var Job = require('./lib/job');

/*
 * This whole app is using sync'd IO calls. Consider using async methods.
 * The problem with async operations is that the compression tasks pile up and
 * can become unresponsive. Also look into those pesky "max open file
 * descriptors" errors
 */

module.exports = {
  compress: function (inputs, settings) {
    var defaults = {
      dry: false,
      inputs: [],
      quiet: false,
      recursive: false,
      verbose: false
    };
    
    // Merge defaults with settings
    Object.keys(defaults).forEach(function (key) {
      settings[key] = (typeof settings[key] !== 'undefined') ? settings[key] : defaults[key];
    });
    
    // Normalize inputs to array if just given a string
    (typeof inputs === 'string') && settings.inputs.push(inputs);
    
    // Create a new pulverizr job
    var job = new Job(settings);
    
    job.run();
    
    return job;
  }
};
