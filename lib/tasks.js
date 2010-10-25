var exec = require('child_process').exec
  , fs = require('fs')
  , log
  , promise = require('promised-io');

module.exports = {
	GIF: function (filename, options, promise) {
		exec('gifsicle -O -b "' + filename + '"', function (error, stdout, stderror) {
			if (error) {
				if (error.code === 127 && options.loud) {
					sys.puts('Could not find "gifsicle". Skipping on: ' + filename);
				}
			}
			promise.resolve(fs.statSync(filename));
		});

		return promise;
	},

	JPEG: function (filename, options, promise) {
		// jpegtran won't let us overwrite the file
		var jpegtranTmp = generateFilename();

		var jpegtran = 'jpegtran -copy none ';
		if (options.aggressive) {
			jpegtran += '-progressive ';
		}
		jpegtran += '-optimize -outfile ' + jpegtranTmp + ' "' + filename + '"';

		exec(jpegtran, function (error, stdout, stderror) {
			if (error) {
				if (error.code === 127 && options.loud) {
					sys.puts('Could not find "jpegtran". Skipping on: ' + filename);
				}
			} else {
				fs.renameSync(jpegtranTmp, filename);
			}
			promise.resolve(fs.statSync(filename));
		});

		return promise;
	},

	PNG: function (filename, options, promise) {
		// pngcrush won't let us overwrite the file
		var pngcrushTmp = generateFilename(),
			optipngLevel = 'o1'; // Default compression level for optipng

		if (options.aggressive) {
			optipngLevel = 'o7'; // Most agressive compression level for optipng
		} 

		exec('optipng -' + optipngLevel + ' "' + filename + '"', function (error, stdout, stderror) {
			if (error) {
				if (error.code === 127 && options.loud) {
					sys.puts('Could not find "optipng". Skipping on: ' + filename);
				}
			}

			// Handle a case where a file has a .png extension but it not actually a proper .png
			try {
				var badPng = fs.statSync(filename + '.png');
				if (badPng) {
					fs.renameSync(filename + '.png', filename);
				}
			} catch (e) {
				// Everything is normal
			}

			exec('pngcrush -nofilecheck -q "' + filename + '" ' + pngcrushTmp, function (error, stdout, stderror) {
				if (error || stdout.match('pngcrush caught libpng error')) {
					if (error && error.code === 127 && options.loud) {
						sys.puts('Could not find "pngcrush". Skipping on: ' + filename);
					}
				} else {
					fs.renameSync(pngcrushTmp, filename);
				}
				promise.resolve(fs.statSync(filename));
			});
		});

		return promise;
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
