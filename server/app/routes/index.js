const KoaRouter = require('koa-router')
const requireDir = require('require-directory')
const DBConnection = require('./dbConnection')
const rootRouter = new KoaRouter()

;(function () {
  const routerArr = []
  requireDir(module, '../routes', {
    visit (router) {
      routerArr.push(router.routes())
    },
    exclude: /^(index.js)|(dbConnection.js)$/
  })
  rootRouter
    .use(DBConnection)
    .use(...routerArr)
})()

module.exports = rootRouter

// (function () {
//   const routerArr = []
//   requireDir(module, '../routes', {
//     visit (router) {
//       routerArr.push(router)
//     },
//     exclude: /^index.js$/
//   })
//   return {
//     async DBConnect (ctx, next) {
//       if (routerArr[ctx.path.split('?')[0]])rootRouter.use(DBConnection)
//       await next()
//     },
//     router () {
//       const root = rootRouter.use(...routerArr)
//       return root
//     }
//   }
// })()
