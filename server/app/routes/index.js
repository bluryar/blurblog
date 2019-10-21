const KoaRouter = require('koa-router')
const requireDir = require('require-directory')
const DBConnection = require('./^dbConnection')
const loadDao = require('./^loadDao.js')
const rootRouter = new KoaRouter()

;(function () {
  const routerArr = []
  requireDir(module, __dirname, {
    visit (router) {
      routerArr.push(router.routes())
    },
    exclude (path) {
      console.log(`app/routes/index: auto loading file: ${path.match(/\^\w+\.js$/)}`)
      return /\^\w+\.js$/.test(path) ? 1 : 0
    }
  })
  rootRouter
    .use(DBConnection)
    .use(loadDao)
    .use(...routerArr)
})()

module.exports = rootRouter
