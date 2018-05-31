
const log4js = require('log4js');
const { join } = require('path');

log4js.configure({
    appenders: { 
        out: { type: 'stdout' },
        all: { 
            type: 'file', 
            filename: join(__dirname, '../logs/all.log'), 
            maxLogSize: 10485760, 
            backups: 3, 
            compress: true,
        },
        emergencies: {
            type: 'file',
            filename: join(__dirname, '../logs/err.log'),
            maxLogSize: 10485760, 
            backups: 3, 
            compress: true,
        },
        develepment: {
            type: 'file',
            filename: join(__dirname, '../logs/debug.log'),
            maxLogSize: 10485760, 
            backups: 3, 
            compress: true,
        },
        err: {
            type: 'logLevelFilter',
            appender: 'emergencies',
            level: 'error'
        },
        debug: {
            type: 'logLevelFilter',
            appender: 'develepment',
            level: 'debug'
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'debug' },
        leu: { appenders: ['out', 'all', 'err', 'debug'], level: 'all' }
    }
});


module.exports = log4js.getLogger('leu');



