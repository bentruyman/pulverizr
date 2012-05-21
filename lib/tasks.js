var exec = require('child_process').exec,
    fs = require('fs');

var generateFilename = require('./utils').generateFilename;

module.exports = {
  GIF:  require('./tasks/gif'),
  JPEG: require('./tasks/jpeg'),
  PNG:  require('./tasks/png')
};
