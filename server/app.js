const AppManager = require('./lib/AppManager')

const httpErrorCatcher = require('./app/middleware/httpErrorCatcher')// 引入全局http异常处理中间件
const httpLogger = require('./app/middleware/httpLogger') // http日志便捷中间件

const Koa = require('koa')
const cors = require('@koa/cors')
const bodypaser = require('koa-bodyparser')
const app = new Koa()
const am = new AppManager(app) // 获取管理者单例，并且加载全局配置、日志、异常

app
  .use(cors()) // 处理跨域问题
  .use(httpLogger()) // 为ctx添加logger
  .use(httpErrorCatcher) // 全局异常处理
  .use(bodypaser()) // 参数解析

am.loadRouterFileToApp(app) // 添加路由

app.listen(global.config.port, () => {
  console.log(`Your application is running at http://localhost:${global.config.port}`)
})
