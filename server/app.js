// 设置全局变量 config\logger\HttpError
require('./lib/AppManager')().load() // 获取管理者单例

/// 自定义中间件
const httpErrorCatcher = require('./app/middleware/httpErrorCatcher') // 引入全局http异常处理中间件
const httpLogger = require('./app/middleware/httpLogger') // http日志便捷中间件
const rootRouter = require('./app/routes/index')
const validators = require('./app/middleware/validators')

/// 第三方中间件
const Koa = require('koa')
const cors = require('@koa/cors')
const bodyparser = require('koa-bodyparser')

// Koa实例
const app = new Koa()
// AppManager实例

app
  .use(cors()) // 处理跨域问题
  .use(httpLogger()) // 为ctx添加logger
  .use(httpErrorCatcher) // 全局异常处理
  .use(bodyparser()) // 参数解析
  .use(validators) // 校验器类簇对象
  .use(rootRouter.routes()) // 添加路由
  .use(rootRouter.allowedMethods())

app.listen(global.config.port, () => {
  console.log(`Your application is running at http://localhost:${global.config.port}`)
})
