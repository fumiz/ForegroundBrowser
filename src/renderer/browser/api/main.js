'use strict';

var BrowserWindow = require('browser-window');

module.exports = {
    open: function(url){
        var window = new BrowserWindow({width: 1000, height: 1000});
        window.loadUrl('file://' + __dirname + '/../index.html');
        window.webContents.on('did-finish-load', function(){
            this.send('app-ready', url);
        });
        window.on('close', function(){
            this.send('app-end');
        });
        return window;
    }
};
