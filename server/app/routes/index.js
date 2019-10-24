const KoaRouter = require('koa-router')
const requireDir = require('require-directory')
const DBConnection = require('./NAL-dbConnection')
const loadDao = require('./NAL-loadDao.js')
const rootRouter = new KoaRouter()

const koaJwt = require('koa-jwt')
const {
  secretKey: secret,
  issuer
} = global.config.security
const regExp = /NAL-\w+.js/;
(function () {
  const routerArr = []
  requireDir(module, __dirname, {
    visit (router) {
      routerArr.push(router.routes())
    },
    exclude (path) {
      if (path.match(regExp)) {
        global.logger.default.info(`app/routes/index.js: auto-loading module ignore this file: ${path.match(regExp)}`)
      } else global.logger.default.info(`app/routes/index.js: auto-loading module LOADING this file: ${path.match(/\w+\.js$/)}`)
      return regExp.test(path) ? 1 : 0
    }
  })
  rootRouter.use(koaJwt({
    secret,
    issuer
  }).unless({
    path: [/\/login/, /\/register/] // 不需要鉴权的路由
  }))
    .use(DBConnection)
    .use(loadDao)
    .use(...routerArr)
})()

module.exports = rootRouter
