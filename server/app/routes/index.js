const KoaRouter = require('koa-router')
const requireDir = require('require-directory')
const DBConnection = require('./Middlewares/NAL-dbConnection')
const loadDao = require('./Middlewares/NAL-loadDao.js')
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
    path: [/\/login/, /\/register/], // 匹配/user/admin接口不需要鉴权的路由
    custom (ctx) { // 匹配除了/user/admin接口外不需要鉴权的路由
      if (/get/i.test(ctx.method)) {
        const getAnArticle = /\/article\/\w{24}/i
        if (getAnArticle.test(ctx.path)) return true
        const getPageArticle = /\/article$/
        if (getPageArticle.test(ctx.path)) return true
        const getAnCategory = /\/category\/\w{24}/i
        if (getAnCategory.test(ctx.path)) return true
        const getPageCategory = /\/category$/
        if (getPageCategory.test(ctx.path)) return true
        const getAnComment = /\/comment\/\w{24}/i
        if (getAnComment.test(ctx.path)) return true
        const getPageComment = /\/comment$/
        if (getPageComment.test(ctx.path)) return true
      }
      return false
    }
  }))
    .use(DBConnection)
    .use(loadDao)
    .use(...routerArr)
})()

module.exports = rootRouter
