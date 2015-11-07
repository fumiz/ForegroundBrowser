var ipc = require('ipc');
var messages = require('./lib/messages.js');

module.exports = {
    stick: function() {
        ipc.send(messages.stick);
    },
    unstick: function() {
        ipc.send(messages.unstick);
    }
};
