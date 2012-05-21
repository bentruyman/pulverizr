var exec = require('child_process').exec,
    fs = require('fs');

var temp = require('temp');

module.exports = function JPG (options) {
  temp.open('PULVERIZR', function (err, info) {
    // jpegtran won't let us overwrite the file
    var jpegtranTmp = info.path;
    
    var jpegtran = 'jpegtran -copy none ';
    if (options.settings.aggressive) {
      jpegtran += '-progressive ';
    }
    jpegtran += '-optimize -outfile ' + jpegtranTmp + ' "' + options.filename + '"';
    
    exec(jpegtran, function (error, stdout, stderror) {
      if (error) {
        if (error.code === 127 && options.settings.loud) {
          options.job.emit('error-compressor', {
            compressor: 'jpegtran',
            filename: options.original
          });
        } else {
          options.job.emit('error-compression', {
            compressor: 'jpegtran',
            filename: options.original,
            error: stderror
          });
        }
      } else {
        fs.renameSync(jpegtranTmp, options.filename);
      }
      options.deferred.resolve(fs.statSync(options.filename));
    });
  });
  
  return options.deferred.promise;
};
