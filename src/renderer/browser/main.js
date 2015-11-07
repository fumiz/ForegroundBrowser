'use strict';

var ipc = require('ipc');
var Vue = require('vue');
var mainApp = require('../../browser/api/main.js');


function Application(id) {
    var self = this;
    this.webview = document.getElementById(id).getElementsByTagName('webview')[0];
    this.browser = {
        'currentUrlText': 'about:blank',
        'canGoBack': false,
        'canGoForward': false,
        'loading': false,
        'sticky': false
    };
    this.vue = new Vue({
        el: '#' + id,
        data: this.browser,
        methods: {
            back: function (event) {
                self.goBack();
            },
            forward: function (event) {
                self.goForward();
            },
            reload: function (event) {
                self.reload();
            },
            load: function (event) {
                self.open(self.browser.currentUrlText);
            },
            devTool: function (event) {
                self.openDevTools();
            },
            stick: function (event) {
                self.toggleStick();
            },
        },
        computed: {
            canGoForwardClass: function () {
                return {
                    'ready': self.browser.canGoForward,
                    'disabled': !self.browser.canGoForward
                };
            },
            canGoBackClass: function () {
                return {
                    'ready': self.browser.canGoBack,
                    'disabled': !self.browser.canGoBack
                };
            }
        }
    });

    this.webview.addEventListener('did-start-loading', function (e) {
        self.setLoading(true);
    });
    this.webview.addEventListener('did-stop-loading', function (e) {
        self.setLoading(false);
    });
    this.webview.addEventListener('did-finish-load', function (e) {
        self.browser.currentUrlText = e.target.getAttribute('src');
        self.browser.canGoBack = e.target.canGoBack();
        self.browser.canGoForward = e.target.canGoForward();
    });
}
Application.prototype.setLoading = function (nowLoading) {
    this.browser.loading = nowLoading;
};
Application.prototype.open = function (url) {
    this.webview.setAttribute('src', url);
};
Application.prototype.goBack = function () {
    if (!this.webview.canGoBack()) {
        return;
    }
    this.webview.goBack();
};
Application.prototype.goForward = function () {
    if (!this.webview.canGoForward()) {
        return;
    }
    this.webview.goForward();
};
Application.prototype.reload = function () {
    this.webview.reload();
};
Application.prototype.openDevTools = function () {
    this.webview.openDevTools();
};
Application.prototype.toggleStick = function () {
    this.browser.sticky = !this.browser.sticky;
    if (this.browser.sticky) {
        mainApp.stick();
    } else {
        mainApp.unstick();
    }
};

var app = null;

ipc.on('app-ready', function (url) {
    app = new Application('app');
    app.open(url);
});
ipc.on('app-end', function () {
    app = null;
});
