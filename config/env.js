// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
 // injected into the application via DefinePlugin in Webpack configuration.

var REACT_APP = /^REACT_APP_/i;
var NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');

// you can change the back-end mode easily below: CSP_REST_MODE enables direct REST calls to Caché's CSP/REST Gateway'
// when CSP_REST_MODE = false, the ToDo app is using the local EWD 3 server
module.exports = Object
  .keys(process.env)
  .filter(key => REACT_APP.test(key))
  .reduce((env, key) => {
    env['process.env.' + key] = JSON.stringify(process.env[key]);
    return env;
  }, {
    'process.env.NODE_ENV': NODE_ENV,
    'EWD_URL': JSON.stringify((NODE_ENV === '"development"') ? 'http://localhost:8090' : 'http://ewd-production-url:ewd-production-port'),
    'CSP_URL': JSON.stringify((NODE_ENV === '"development"') ? 'http://localhost:57772/csp/user/rest/api/todo' : 'http://csp-production-url:csp-production-port'),
    'CSP_REST_MODE': false
  });
