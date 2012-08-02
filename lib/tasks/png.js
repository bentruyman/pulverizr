var spawn = require('child_process').spawn,
    fs = require('fs');

var temp = require('temp'),
    Q = require('q');

module.exports = function PNG (options) {
  var deferred = Q.defer(),
      pngcrush;
  
  var pngcrushTemp = temp.openSync('PULVERIZR');
  
  var args = ['-nofilecheck', '-q'];
  
  if (options.settings.aggressive) {
    args.push(' -brute');
  }
  
  args.push(options.path);
  args.push(pngcrushTemp.path);
  
  pngcrush = spawn('pngcrush', args);
  
  pngcrush.on('exit', function (code) {
    if (code === 127) {
      options.job.emit('error-compressor', {
        compressor: 'pngcrush',
        filename: options.original
      });
    } else {
      fs.renameSync(pngcrushTemp.path, options.path);
    }
    
    fs.closeSync(pngcrushTemp.fd);
    
    deferred.resolve(fs.statSync(options.path));
  });
  
  return deferred.promise;
};
