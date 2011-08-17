var Log = require('../lib/coloured-log')
  , log = new Log(Log.DEBUG)

log.emergency('Site just went down!')
log.alert('Cannot connect to datastore!')
log.critical('Request timeout')
log.error('Exception thrown by controller')
log.warning('Couldn\'t find the user\'s session')
log.notice('Viewname wasn\'t defined')
log.info('Connected to database')
log.debug('Hello World')
log.debug('Here\' an object: %s', { foo: 'bar', baz: true});
