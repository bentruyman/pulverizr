var exec = require('child_process').exec,
    fs = require('fs');

module.exports = {
	GIF: function (options) {
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

		return options.deferred.promise;
	},

	PNG: function (options) {
		// pngcrush won't let us overwrite the file
		var pngcrushTmp = generateFilename(),
			optipngLevel = 'o1'; // Default compression level for optipng

		if (options.settings.aggressive) {
			optipngLevel = 'o7'; // Most agressive compression level for optipng
		}

		exec('optipng -' + optipngLevel + ' "' + options.filename + '"', function (error, stdout, stderror) {
			if (error) {
				if (error.code === 127 && options.settings.loud) {
					options.log.notice('Couldn\'t find "optipng". Skipping on: ' + options.original);
				} else {
					options.log.warning('Couldn\'t compress "' + options.original + '" with optipng');
					err(stderror, options.log);
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
						options.log.notice('Couldn\'t find "pngcrush". Skipping on: ' + options.original);
					} else {
						options.log.warning('Couldn\'t compress "' + options.original + '" with pngcrush');
						err(stderror, options.log);
					}
				} else {
					fs.renameSync(pngcrushTmp, options.filename);
				}
				options.deferred.resolve(fs.statSync(options.filename));
			});
		});

		return options.deferred.promise;
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

function err (stderror, log) {
	if (stderror && log) {
		stderror = stderror.split('\n');
		stderror.forEach(function (line) {
			if (line) {
				log.error(line);
			}
		});
	}
}
