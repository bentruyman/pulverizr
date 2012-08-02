var exec = require('child_process').exec,
    fs = require('fs');

var Q = require('q');

module.exports = function GIF (options) {
  var deferred = Q.defer();
  
  exec('gifsicle -O -b "' + options.path + '"', function (error, stdout, stderror) {
    if (error) {
      if (error.code === 127 && options.settings.loud) {
        options.job.emit('error-compressor', {
          compressor: 'gifsicle',
          filename: options.original
        });
      } else {
        options.job.emit('error-compression', {
          compressor: 'gifsicle',
          filename: options.original,
          error: stderror
        });
      }
    }
    deferred.resolve(fs.statSync(options.path));
  });
  
  return deferred.promise;
};
