const log4js = require('log4js')
const path = require('path')

module.exports = function () {
  if (!global.config) throw new Error('请先设置应用配置')
  log4js.configure({
    replaceConsole: true,
    appenders: {
      httpError: {
        type: 'dateFile',
        filename: `${path.join(global.config.baseDIR, 'log', '/http-error')}`,
        pattern: '.yyyy-MM-dd.log',
        daysToKeep: 15,
        keepFileExt: true,
        alwaysIncludePattern: true
      },
      customError: {
        type: 'dateFile',
        filename: `${path.join(global.config.baseDIR, 'log', '/custom-error')}`,
        pattern: '.yyyy-MM-dd.log',
        daysToKeep: 15,
        keepFileExt: true,
        alwaysIncludePattern: true
      },
      database: {
        type: 'dateFile',
        filename: `${path.join(global.config.baseDIR, 'log', '/databse')}`,
        pattern: '.yyyy-MM-dd.log',
        daysToKeep: 15,
        keepFileExt: true,
        alwaysIncludePattern: true
      },
      customeInfo: {
        type: 'dateFile',
        filename: `${path.join(global.config.baseDIR, 'log', '/custome-info')}`,
        pattern: '.yyyy-MM-dd.log',
        daysToKeep: 15,
        keepFileExt: true,
        alwaysIncludePattern: true
      },
      stdout: {
        type: 'stdout'
      }
    },
    categories: {
      default: {
        appenders: ['stdout'],
        level: 'all'
      },
      HTTP_ERROR: {
        appenders: ['stdout', 'httpError'],
        level: 'warn'
      },
      CUSTOM_ERROR: {
        appenders: ['stdout', 'customError'],
        level: 'error'
      },
      DATABASE: {
        appenders: ['stdout', 'database'],
        level: 'info'
      },
      CUSTOM_INFO: {
        appenders: ['stdout', 'customeInfo'],
        level: 'info'
      }
    }
    // pm2: true,
    // pm2InstanceVar: 'INSTANCE_ID',
    // disableClustering: true
  })
  return log4js
}
