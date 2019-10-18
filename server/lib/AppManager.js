const EventEmitter = require('events')

const configDefault = require('../config/config.default')
const configDev = require('../config/config.dev')
const configProd = require('../config/config.prod')
const configTest = require('../config/config.test')

const HttpError = require('./http-error')
const getLog4js = require('./logger')
/**
 * 加载配置到全局环境、并且对不同配置根据优先级进行覆盖操作
 */
const loadConfigToGlobal = (function () {
  if (!process.env.NODE_ENV) throw new Error('未设置应用环境(NODE_ENV=undefined)')
  const tempConfig = {
    default: configDefault,
    dev: configDev,
    prod: configProd,
    test: configTest
  }
  if (!tempConfig[process.env.NODE_ENV]) throw new Error(`环境设置错误(NODE_ENV=${process.env.NODE_ENV}`)
  const config = {
    ...configDefault, // default的优先级最低
    ...tempConfig[process.env.NODE_ENV]
  }
  return async function () {
    global.config = config
  }
})()

const loadHttpErrorToGlobal = async () => {
  global.HttpError = HttpError
}

const loadLoggerToGlobal = async () => {
  const log4js = getLog4js()
  global.log = {
    HTTP_ERROR: log4js.getLogger('HTTP_ERROR'),
    CUSTOM_ERROR: log4js.getLogger('CUSTOM_ERROR'),
    DATABASE: log4js.getLogger('DATABASE'),
    /**
     * @property 代替console.log
     */
    default: log4js.getLogger('default')
  }
}

/**
 * @todo 路由添加
 * @event configMounted 已经添加全局配置
 * @event errMounted 已经添加全局异常
 * @event loggerMounted 已经添加全局日志对象
 * @event routerMounted 已经讲路由挂载到App实例下
 */
class AppManager extends EventEmitter {
  constructor (app) {
    super()
    // 创建单例
    if (!AppManager.instance) {
      this.app = app
      loadConfigToGlobal().then(() => this.emit('configMounted')) // 利用箭头函数没有绑定this
      loadHttpErrorToGlobal().then(() => this.emit('errorMounted'))
      loadLoggerToGlobal().then(() => this.emit('logerMounted'))
      return this
    } else {
      return AppManager.instance
    }
  }

  loadRouterFileToApp () {
    this.emit('routerMounted', this.app)
  }
}
module.exports = AppManager
