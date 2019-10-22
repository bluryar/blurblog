const EventEmitter = require('events')

/**
 * 加载配置到全局环境、并且对不同配置根据优先级进行覆盖操作
 */
const loadConfigToGlobal = (function () {
  if (!process.env.NODE_ENV) throw new Error('未设置应用环境(NODE_ENV=undefined)')
  const tempConfig = {
    default: require('../config/config.default'),
    dev: require('../config/config.dev'),
    prod: require('../config/config.prod'),
    test: require('../config/config.test')
  }
  if (!tempConfig[process.env.NODE_ENV]) throw new Error(`环境设置错误(NODE_ENV=${process.env.NODE_ENV}`)

  return async function () {
    global.config = {
      ...tempConfig.default, // default的优先级最低
      ...tempConfig[process.env.NODE_ENV]
    }
  }
})()

const loadHttpErrorToGlobal = async () => {
  global.HttpError = require('./http-error')
}

const loadLoggerToGlobal = async () => {
  const log4js = require('./logger')()
  global.logger = {
    HTTP_ERROR: log4js.getLogger('HTTP_ERROR'),
    CUSTOM_ERROR: log4js.getLogger('CUSTOM_ERROR'),
    DATABASE: log4js.getLogger('DATABASE'),
    default: log4js.getLogger('default'),
    CUSTOM_INFO: log4js.getLogger('CUSTOM_INFO')
  }
}

/**
 * @event configMounted 已经添加全局配置
 * @event errMounted 已经添加全局异常
 * @event loggerMounted 已经添加全局日志对象
 * @event success 所有全局配置以及设置成功
 */
class AppManager extends EventEmitter {
  constructor (app) {
    super()
    // 创建单例
    if (!AppManager.instance) {
      this._app = app
      AppManager.instance = this
      return this
    } else {
      return AppManager.instance
    }
  }

  load () {
    loadConfigToGlobal()
    loadHttpErrorToGlobal()
    loadLoggerToGlobal()
  }

  /**
   * @deprecated 将自动加载模块移动到routes目录下的index.js
   */
  loadRouterFileToApp () {
    // this.emit('routerMounted', this.app)
    throw new Error('遗留接口，已废弃')
  }
}
module.exports = function (app) {
  return new AppManager(app)
}
