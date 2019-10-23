const KoaRouter = require('koa-router')
const requireDir = require('require-directory')
const DBConnection = require('./NAL-dbConnection')
const loadDao = require('./NAL-loadDao.js')
const rootRouter = new KoaRouter()

const regExp = /NAL-\w+.js/
;
(function () {
  const routerArr = []
  requireDir(module, __dirname, {
    visit (router) {
      routerArr.push(router.routes())
    },
    exclude (path) {
      if (path.match(regExp)) {
        console.log(`app/routes/index.js: auto-loading module ignore this file: ${path.match(regExp)}`)
      } else console.log(`app/routes/index.js: auto-loading module LOADING this file: ${path.match(/\w+\.js$/)}`)
      return regExp.test(path) ? 1 : 0
    }
  })
  rootRouter
    .use(DBConnection)
    .use(loadDao)
    .use(...routerArr)
})()

module.exports = rootRouter
