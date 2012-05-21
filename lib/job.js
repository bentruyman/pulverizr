var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter;

var temp = require('temp'),
    tasks = require('./tasks'),
    Q = require('q');

// Map of extensions to tasks
var extensions = {
  gif: 'GIF',
  jpg: 'JPEG',
  jpeg: 'JPEG',
  png: 'PNG'
};

var Job = module.exports = function (settings) {
  var self = this;
  
  this.queue = [];
  this.report = {
    fileCount: 0,
    scanned: {},
    size: {
      start: 0,
      end: 0
    },
    time: {
      start: null,
      end: null
    }
  };
  this.settings = settings;
  
  this.settings.inputs.forEach(function (input) {
    var files = self.scan(input, 0);
    
    files.forEach(function (file) {
      self.add(file);
    });
  });
};

// Job extends EventEmitter
Job.prototype = new EventEmitter;

Job.prototype.add = function (filename) {
  var self = this;
  
  // Try to find a task for the current file. If nothing is found, no task is executed
  var task = tasks[extensions[path.extname(filename).substr(1)]];
  
  if (task) {
    this.queue.push(function () {
      return self.compress(filename, task);
    });
    
    return ++this.report.fileCount;
  } else {
    return false;
  }
};

Job.prototype.compress = function (filename, task) {
  var deferred = Q.defer(),
      self = this;
  
  temp.open('PULVERIZR', function (err, info) {
    var scratchSpace = info.path;
    
    // Copy the old file to a temporary spot
    exec('cp "' + filename + '" ' + scratchSpace, function (error, stdout, stderr) {
      task.call(this, {
        original: filename,
        filename: scratchSpace,
        settings: self.settings,
        deferred: deferred,
        job: self
      }).then(function (newStats) {
        var oldStats = fs.statSync(filename);
        
        self.report.size.start += oldStats.size;
        self.report.size.end += newStats.size;
        
        self.emit('compression', {
          filename: filename,
          oldSize: oldStats.size,
          newSize: newStats.size
        });
        
        // If optimizations were made and this isn't a dry run, copy the new file over
        if (!self.settings.dryRun && newStats.size < oldStats.size) {
          fs.renameSync(scratchSpace, filename);
        } else {
          // Remove the temporary file
          fs.unlinkSync(scratchSpace);
        }
      });
    });
  });
  
  return deferred.promise;
};

Job.prototype.run = function () {
  var self = this,
      result = Q.resolve();
  
  this.emit('start', {});
  
  this.report.time.start = Date.parse(new Date());
  
  // run the queue
  this.queue.forEach(function (f) {
    result = result.then(f);
  });
  
  result.then(function () {
    var r = self.report;
    
    r.time.end = Date.parse(new Date());
    
    self.emit('finish', r);
  });
};

Job.prototype.scan = function (filename, depth) {
  var self = this,
      files = [];
  
  (function walk (filename, depth) {
    var stats = fs.statSync(filename);
    
    if (stats.isFile()) {
      files.push(filename);
    } else if ((self.settings.recursive || depth === 0) && !self.report.scanned[filename] && stats.isDirectory()) {
      depth++;
      fs.readdirSync(filename).forEach(function (_filename) {
        // Scans the directory, and strips off a trailing slash if it exists
        walk.call(this, (filename.replace(/(\/)$/g, '') + '/' + _filename), depth);
      });
    }
  }(filename, 0));
  
  return files;
};
