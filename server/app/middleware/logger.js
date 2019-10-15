const log4js = require('log4js')
const config = require('../../config/config.dev')
const path = require('path')

log4js.configure({
  replaceConsole: true,
  appenders: {
    httpError: {
      type: 'dateFile',
      filename: `${path.join(config.baseDIR, 'log', '/http-error')}`,
      pattern: '.yyyy-MM-dd.log',
      daysToKeep: 15,
      keepFileExt: true,
      alwaysIncludePattern: true
    },
    customError: {
      type: 'dateFile',
      filename: `${path.join(config.baseDIR, 'log', '/custom-error')}`,
      pattern: '.yyyy-MM-dd.log',
      daysToKeep: 15,
      keepFileExt: true,
      alwaysIncludePattern: true
    },
    database: {
      type: 'dateFile',
      filename: `${path.join(config.baseDIR, 'log', '/databse')}`,
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
    }
  }
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  // disableClustering: true
})

module.exports = async (ctx, next) => {
  ctx.logger = {
    HTTP_ERROR: log4js.getLogger('HTTP_ERROR'),
    CUSTOM_ERROR: log4js.getLogger('CUSTOM_ERROR'),
    DATABASE: log4js.getLogger('DATABASE'),
    /**
     * @property 代替console.log
     */
    default: log4js.getLogger('default')
  }
  await next()
}
