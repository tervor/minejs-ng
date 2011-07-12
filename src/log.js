/*!
 * Log.js
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var EventEmitter = require('events').EventEmitter;

var Log = exports = module.exports = function Log(level, stream) {
    if ('string' == typeof level) level = exports[level.toUpperCase()];
    this.level = level || exports.DEBUG;
    this.stream = stream || process.stdout;
    if (this.stream.readable) this.read();
};

exports.EMERGENCY = 0;
exports.ALERT = 1;
exports.CRITICAL = 2;
exports.ERROR = 3;
exports.WARNING = 4;
exports.NOTICE = 5;
exports.INFO = 6;
exports.DEBUG = 7;


Log.prototype = {

    log: function(levelStr, args) {
        if (exports[levelStr] <= this.level) {
            var i = 1;
            var msg = args[0].replace(/%s/g,
            function() {
                return args[i++];
            });
            var str = '[' + new Date().toUTCString() + ']'
            + ' ' + levelStr
            + ' ' + msg
            + '\n';
            this.stream.write(str);
            this.emit('log', levelStr, msg);
        }
    },

    emergency: function(msg) {
        this.log('EMERGENCY', arguments);
    },

    alert: function(msg) {
        this.log('ALERT', arguments);
    },

    critical: function(msg) {
        this.log('CRITICAL', arguments);
    },

    error: function(msg) {
        this.log('ERROR', arguments);
    },

    warning: function(msg) {
        this.log('WARNING', arguments);
    },

    notice: function(msg) {
        this.log('NOTICE', arguments);
    },

    info: function(msg) {
        this.log('INFO', arguments);
    },

    debug: function(msg) {
        this.log('DEBUG', arguments);
    },
};

Log.prototype.__proto__ = EventEmitter.prototype;