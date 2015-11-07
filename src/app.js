'use strict';

var app = require('app');
var application = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    application = new Application();
    application.start();
});

var ipc = require('ipc');
var messages = require('./browser/api/lib/messages.js');

function Application() {
    this.listeners = [
        [messages.stick, this.stick],
        [messages.unstick, this.unstick]
    ];
}
Application.prototype = {
    start: function () {
        this.init();

        var browser = require('./renderer/browser/api/main.js');
        browser.open('about:blank');
    },
    init: function () {
        var self = this;

        var listeners = this.listeners;
        for (var idx = 0; idx < listeners.length; idx++) {
            (function (message, func) {
                ipc.on(message, function (event, obj) {
                    // this, eventEmitter, event
                    func.call(self, {
                        emitter: this,
                        event: event
                    }, obj);
                });
            })(listeners[idx][0], listeners[idx][1]);
        }
    },
    stick: function (event) {
        var browserWindow = event.event.sender.getOwnerBrowserWindow();
        browserWindow.setAlwaysOnTop(true);
    },
    unstick: function (event) {
        var browserWindow = event.event.sender.getOwnerBrowserWindow();
        browserWindow.setAlwaysOnTop(false);
    }
};