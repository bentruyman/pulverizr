var exec = require('child_process').exec,
    fs = require('fs');

var temp = require('temp'),
    Q = require('q');

module.exports = function JPG (options) {
  var deferred = Q.defer();
  
  var scratch = temp.openSync('PULVERIZR');
    
  // jpegtran won't let us overwrite the file
  var jpegtranTmp = scratch.path;
  
  var jpegtran = 'jpegtran -copy none ';
  if (options.settings.aggressive) {
    jpegtran += '-progressive ';
  }
  jpegtran += '-optimize -outfile ' + jpegtranTmp + ' "' + options.path + '"';
  
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
      fs.renameSync(jpegtranTmp, options.path);
    }
    
    fs.closeSync(scratch.fd);
    
    deferred.resolve(fs.statSync(options.path));
  });
  
  return deferred.promise;
};
