
/// 自定义中间件
const httpErrorCatcher = require('./app/middleware/httpErrorCatcher') // 引入全局http异常处理中间件
const httpLogger = require('./app/middleware/httpLogger') // http日志便捷中间件
const rootRouter = require('./app/routes/index')

/// 第三方中间件
const Koa = require('koa')
const cors = require('@koa/cors')
const bodypaser = require('koa-bodyparser')

// Koa实例
const app = new Koa()
// AppManager实例
const am = require('./lib/AppManager')(app) // 获取管理者单例

am.load() // 设置全局变量 config\logger\HttpError

app
  .use(cors()) // 处理跨域问题
  .use(httpLogger()) // 为ctx添加logger
  .use(httpErrorCatcher) // 全局异常处理
  .use(bodypaser()) // 参数解析
  .use(rootRouter.routes()) // 添加路由
  .use(rootRouter.allowedMethods())

app.listen(global.config.port, () => {
  console.log(`Your application is running at http://localhost:${global.config.port}`)
})
