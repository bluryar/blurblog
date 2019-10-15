// 引入配置文件
const config = require(`./config/config.${process.env.NODE_ENV}`)
// 引入全局http异常处理中间件
const httpErrorCatcher = require('./app/middleware/httpErrorCatcher')
// 引入日志处理中间件
const logger = require('./app/middleware/logger')
const Koa = require('koa')
const cors = require('@koa/cors')
const bodypaser = require('koa-bodyparser')
const app = new Koa()

app
  .use(cors()) // 处理跨域问题
  .use(logger) // 为ctx添加logger
  .use(httpErrorCatcher) // 全局异常处理
  .use(bodypaser()) // 参数解析

app.listen(config.port, () => {
  console.log(`Your application is running at http://localhost:${config.port}`)
})
