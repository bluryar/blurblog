// 引入配置文件
const config = require(`./config/config.${process.env.NODE_ENV}`)
// 引入全局http异常处理中间件
const httpErrorCatcher = require('./app/middleware/httpErrorCatcher')
const Koa = require('koa')
const cors = require('@koa/cors')
const bodypaser = require('koa-bodyparser')

const app = new Koa()

app.use(cors)
  .use(httpErrorCatcher)
  .use(bodypaser)

app.listen(config.port, () => {
  console.log(`Your application is running at http://localhost:${config.port}`)
})
