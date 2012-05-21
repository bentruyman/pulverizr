var Job = require('./lib/job');

/*
 * This whole app is using sync'd IO calls. Consider using async methods.
 * The problem with async operations is that the compression tasks pile up and
 * can become unresponsive. Also look into those pesky "max open file
 * descriptors" errors
 */

module.exports = {
  createJob: function (inputs, settings) {
    settings.inputs = inputs;
    
    // Create a new pulverizr job
    var job = new Job(settings);
    
    return job;
  }
};
