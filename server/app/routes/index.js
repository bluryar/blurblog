const KoaRouter = require('koa-router')
const requireDir = require('require-directory')
const DBConnection = require('./dbConnection')
const loadDao = require('./loadDao')
const rootRouter = new KoaRouter()

;(function () {
  const routerArr = []
  requireDir(module, '../routes', {
    visit (router) {
      routerArr.push(router.routes())
    },
    exclude: /^(index.js)|(dbConnection.js)|(loadDao.js)$/
  })
  rootRouter
    .use(DBConnection)
    .use(loadDao)
    .use(...routerArr)
})()

module.exports = rootRouter
