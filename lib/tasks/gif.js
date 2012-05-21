var exec = require('child_process').exec,
    fs = require('fs');

module.exports = function GIF (options) {
  exec('gifsicle -O -b "' + options.filename + '"', function (error, stdout, stderror) {
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
    options.deferred.resolve(fs.statSync(options.filename));
  });
  
  return options.deferred.promise;
};
