var fs = require('fs');

var utils = module.exports = {
  err: function (stderror, log) {
    if (stderror && log) {
      stderror = stderror.split('\n');
      stderror.forEach(function (line) {
        if (line) {
          log.error(line);
        }
      });
    }
  }
};
