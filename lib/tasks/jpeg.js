var exec = require('child_process').exec,
    fs = require('fs');

var temp = require('temp'),
    err = require('../utils').handleError;

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
          options.log.notice('Couldn\'t find "jpegtran". Skipping on: ' + options.original);
        } else {
          options.log.warning('Couldn\'t compress "' + options.original + '" with jpegtran');
          err(stderror, options.log);
        }
      } else {
        fs.renameSync(jpegtranTmp, options.filename);
      }
      options.deferred.resolve(fs.statSync(options.filename));
    });
  });
  
  return options.deferred.promise;
};
