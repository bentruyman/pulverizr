var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path');

var tasks = require('./tasks'),
    Log = require('coloured-log'),
    Q = require('q');

// Map of extensions to tasks
var extensions = {
	gif: 'GIF',
	jpg: 'JPEG',
	jpeg: 'JPEG',
	png: 'PNG'
};

var Job = module.exports = function Job (settings) {
	var self = this;
	
	if (settings.quiet) {
		this.log = new Log(-1);
	} else if (settings.verbose) {
		this.log = new Log(Log.DEBUG);
	} else {
		this.log = new Log(Log.INFO);
	}
	
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

Job.prototype = {
	add: function (filename) {
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
	},
	compress: function (filename, task) {
		var deferred = Q.defer(),
		    scratchSpace = generateFilename(),
		    self = this;
		
		// Copy the old file to a temporary spot
		exec('cp "' + filename + '" ' + scratchSpace, function (error, stdout, stderr) {
			task.call(this, {
				original: filename,
				filename: scratchSpace,
				settings: self.settings,
				deferred: deferred,
				log: self.log
			}).then(function (newStats) {
				var oldStats = fs.statSync(filename);
				
				self.report.size.start += oldStats.size;
				self.report.size.end += newStats.size;
				
				self.log.debug(filename + ': ' + parseInt(oldStats.size - newStats.size, 10) + ' byte difference');
				
				// If optimizations were made and this isn't a dry run, copy the new file over
				if (!self.settings.dry && newStats.size < oldStats.size) {
					fs.renameSync(scratchSpace, filename);
				} else {
					// Remove the temporary file
					fs.unlinkSync(scratchSpace);
				}
			});
		});
		
		return deferred.promise;
	},
	run: function () {
		var self = this,
		    result = Q.resolve();
		
		this.report.time.start = Date.parse(new Date());
		
		this.log.info('Beginning compressiong job');
		
		// run the queue
		this.queue.forEach(function (f) {
			result = result.then(f);
		});
		
		result.then(function () {
			var r = self.report;
			
			r.time.end = Date.parse(new Date());
			
			self.log.info('Finished compressiong job');
			self.log.info('Scanned ' + r.fileCount + ' files');
			self.log.info('Saved ' + Math.ceil((r.size.start - r.size.end) / 1024) + 'kb');

			if (self.settings.dry) {
				self.log.info('(Files were not modified because this was a dry-run)');
			}
		});
	},
	scan: function (filename, depth) {
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
	}
};

function generateFilename () {
	// Generate a random string
	var filename = process.cwd() + '/' + Math.floor(Math.random() * 1e16).toString(36);

	try {
		fs.statSync(filename);
	} catch (e) {
		// It's good if we get an error, it means the random filename we created doesn't already exist
		return filename;
	}

	// Otherwise we need to try again (what are the chances of that??)
	return generateFilename();
}
