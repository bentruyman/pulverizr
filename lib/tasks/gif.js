var exec = require('child_process').exec,
    fs = require('fs');

var err = require('../utils').handleError;

module.exports = function GIF (options) {
  exec('gifsicle -O -b "' + options.filename + '"', function (error, stdout, stderror) {
    if (error) {
      if (error.code === 127 && options.settings.loud) {
        options.log.notice('Couldn\'t find "gifsicle". Skipping on: ' + options.original);
      } else {
        options.log.warning('Couldn\'t compress "' + options.original + '" with gifsicle');
        err(stderror, options.log);
      }
    }
    options.deferred.resolve(fs.statSync(options.filename));
  });
  
  return options.deferred.promise;
};
