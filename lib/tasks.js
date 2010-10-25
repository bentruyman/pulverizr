var exec = require('child_process').exec
  , fs = require('fs')
  , promise = require('promised-io');

module.exports = {
	GIF: function (options) {
		exec('gifsicle -O -b "' + options.filename + '"', function (error, stdout, stderror) {
			if (error) {
				if (error.code === 127 && options.settings.loud) {
					options.log.notice('Could not find "gifsicle". Skipping on: ' + options.original);
				} else {
					options.log.error('Error compressing "' + options.original + '" with gifsicle');
					stderror && options.log.error(stderror);
				}
			}
			options.promise.resolve(fs.statSync(options.filename));
		});

		return options.promise;
	},

	JPEG: function (options) {
		// jpegtran won't let us overwrite the file
		var jpegtranTmp = generateFilename();

		var jpegtran = 'jpegtran -copy none ';
		if (options.settings.aggressive) {
			jpegtran += '-progressive ';
		}
		jpegtran += '-optimize -outfile ' + jpegtranTmp + ' "' + options.filename + '"';

		exec(jpegtran, function (error, stdout, stderror) {
			if (error) {
				if (error.code === 127 && options.settings.loud) {
					options.log.notice('Could not find "jpegtran". Skipping on: ' + options.original);
				} else {
					options.log.error('Error compressing "' + options.original + '" with jpegtran');
					stderror && options.log.error(stderror);
				}
			} else {
				fs.renameSync(jpegtranTmp, options.filename);
			}
			options.promise.resolve(fs.statSync(options.filename));
		});

		return options.promise;
	},

	PNG: function (options) {
		// pngcrush won't let us overwrite the file
		var pngcrushTmp = generateFilename(),
			optipngLevel = 'o1'; // Default compression level for optipng

		if (options.aggressive) {
			optipngLevel = 'o7'; // Most agressive compression level for optipng
		} 

		exec('optipng -' + optipngLevel + ' "' + options.filename + '"', function (error, stdout, stderror) {
			if (error) {
				if (error.code === 127 && options.settings.loud) {
					options.log.notice('Could not find "optipng". Skipping on: ' + options.original);
				} else {
					options.log.error('Error compressing "' + options.original + '" with optipng');
					stderror && options.log.error(stderror);
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

			exec('pngcrush -nofilecheck -q "' + options.filename + '" ' + pngcrushTmp, function (error, stdout, stderror) {
				if (error || stdout.match('pngcrush caught libpng error')) {
					if (error && error.code === 127 && options.settings.loud) {
						options.log.notice('Could not find "pngcrush". Skipping on: ' + options.original);
					} else {
						options.log.error('Error compressing "' + options.original + '" with pngcrush');
						stderror && options.log.error(stderror);
					}
				} else {
					fs.renameSync(pngcrushTmp, options.filename);
				}
				options.promise.resolve(fs.statSync(options.filename));
			});
		});

		return options.promise;
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
	return arguments.callee.call();
}
