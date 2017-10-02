var Service = require('node-mac').Service;

// Create a new service object
var svc = new Service({
    name:'automation-experiment-client',
    description: 'This is automation-experiment client.',
    script: 'service.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    svc.start();
});

svc.install();





