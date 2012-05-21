var exec = require('child_process').exec,
    fs = require('fs');

var temp = require('temp');

module.exports = function PNG (options) {
  temp.open('PULVERIZR', function (err, info) {
    // pngcrush won't let us overwrite the file
    var pngcrushTmp = info.path,
      optipngLevel = 'o1'; // Default compression level for optipng
      
    if (options.settings.aggressive) {
      optipngLevel = 'o7'; // Most agressive compression level for optipng
    }
    
    exec('optipng -' + optipngLevel + ' "' + options.filename + '"', function (error, stdout, stderror) {
      if (error) {
        if (error.code === 127 && options.settings.loud) {
          options.job.emit('error-compressor', {
            compressor: 'optipng',
            filename: options.original
          });
        } else {
          options.job.emit('error-compression', {
            compressor: 'optipng',
            filename: options.original,
            error: stderror
          });
        }
      }
      
      // Handle a case where a file has a .png extension but it not actually a proper .png
      try {
        var badPng = fs.statSync(options.filename + '.png');
        if (badPng) {
          fs.renameSync(options.filename + '.png', options.filename);
        }
      } catch (e) {
        // Everything is normal
      }
      
      var pngcrush = 'pngcrush -nofilecheck -q';
      
      if (options.settings.aggressive) {
        pngcrush += ' -brute';
      }
      
      pngcrush += ' "' + options.filename + '" ' + pngcrushTmp;
      
      exec(pngcrush, function (error, stdout, stderror) {
        if (error || stdout.match('pngcrush caught libpng error')) {
          if (error && error.code === 127 && options.settings.loud) {
            options.job.emit('error-compressor', {
              compressor: 'pngcrush',
              filename: options.original
            });
          } else {
            options.job.emit('error-compression', {
              compressor: 'pngcrush',
              filename: options.original,
              error: stderror
            });
          }
        } else {
          fs.renameSync(pngcrushTmp, options.filename);
        }
        options.deferred.resolve(fs.statSync(options.filename));
      });
    });
  });
  
  return options.deferred.promise;
};
