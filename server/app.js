// 引入配置文件
const config = require(`./config/config.${process.env.NODE_ENV}`)

const Koa = require('koa')
const cors = require('@koa/cors')
const bodypaser = require('koa-bodyparser')

const app = new Koa()

app.use(cors)
  // .use(httperr)
  .use(bodypaser)

app.listen(config.port, () => {
  console.log(`Your application is running at http://localhost:${config.port}`)
})
