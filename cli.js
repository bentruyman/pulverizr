#!/usr/bin/env node

var pulverizr = require('./pulverizr')
  , sys = require('sys');

var responses = {
	error: function (message) {
		sys.puts('Error occurred: ' + message);
	},
	help: function () {
		sys.puts([
			'Usage: pulverize [OPTIONS]... -- [FILES]...',
			'Smash your images down to size. Pulverizr uses several compressors/optimizers',
			'to squeeze every last bit out of your images. If Pulverizr detects an',
			'optimization, it overwrites the old image with the newly optimized one.',
			'',
			'Options:',
			'',
			' General:',
			'  -a, --aggressive	uses more aggressive compression algorithms (takes longer, \n\t\t\tworks better)',
			'  --dry-run		print summary but don\'t actually modify files',
			'  -q, --quiet		pulverizer will stfu',
			'  -v, --verbose		verbose mode',
			'',
			' Traversing:',
			'  -R, --recursive	scan directories recursively',
			// '  -g, --gif		whitelist gif images',
			// '  -j, --jpeg		whitelist jpeg images',
			// '  -p, --png		whitelist png images',
			'',
			' Other:',
			'  -h, --help		print this handy dandy help page',
			'  --version		print program version',
			''
		].join('\n'));
	},
	report: function () {
		var diff = {
			perc: Math.round((100 * ((report.size.start / report.size.end) - 1)) * 100) / 100,
			size: Math.round(((report.size.start - report.size.end) / 1024) * 100) / 100
		};

		var timeSpent = Math.round(((report.time.end - report.time.start) / 1000) * 10) / 10;

		if (options.loud) {
			sys.puts('');
			sys.puts('Report:');
			sys.puts('  - File Affected: ' + report.fileCount);
			sys.puts('  - Old Size: ' + report.size.start + ' bytes');
			sys.puts('  - New Size: ' + report.size.end + ' bytes');
			sys.puts('  - Savings: ' + diff.size + 'KB (' + diff.perc + '%)');
			sys.puts('  - Time Spent: ' + timeSpent + ' seconds');

			if (options.dry) {
				sys.puts('\nThis was a dry run. No files were actually modified.');
			}

			sys.puts('');
		}
	},
	version: function () {
		sys.puts('Pulverizr v0.0.2');
	}
};

function respond (type) {
	responses[type].call();
}

var argv = require('optimist').argv;

if (argv.help || argv.h) {
	respond('help');
} else if (argv.version) {
	respond('version');
} else if (argv._.length) {
	var settings = {};

	settings.inputs = argv._;

	if (argv.a || argv.aggressive) {
		settings.aggressive = true;
	}

	if (argv['dry-run']) {
		settings.dry = true;
	}

	if (argv.q || argv.quiet) {
		settings.quiet = true;
	}

	if (argv.R || argv.recursive) {
		settings.recursive = true;
	}

	if (argv.v | argv.verbose) {
		settings.verbose = true;
	}

	pulverizr.compress(argv._, settings);
} else {
	respond('help');
}
