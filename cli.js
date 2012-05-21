#!/usr/bin/env node

var program = require('commander'),
    pulverizr = require('./pulverizr'),
    util = require('util');

program
  .version(require('./package').version)
  .usage('[options] <file...>')
  .option('-a, --aggressive', 'Uses more aggressive compression algorithms (takes longer, works better)')
  .option('--dry-run', 'Print summary but don\'t actually modify files')
  .option('-q, --quiet', 'Pulverizer will not report')
  .option('-R, --recursive', 'Recurse through directories')
  .option('-v, --verbose', 'Verbose mode');

program.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    Single File');
  console.log('     pulverize image.png');
  console.log('');
  console.log('    Single Directory');
  console.log('     pulverize /var/www/mysite.com/images/products/backgrounds');
  console.log('');
  console.log('    Multiple Files');
  console.log('     pulverize foo.png bar.png baz.png qux.png');
  console.log('');
  console.log('    Recursive Directory');
  console.log('     pulverize -R -- /var/www/mysite.com/images');
  console.log('');
});

program.parse(process.argv);

pulverizr.compress(program.args, program);
