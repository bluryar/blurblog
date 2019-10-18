const KoaRouter = require('koa-router')

const adminRouter = new KoaRouter({
  prefix: 'user/admin'
})

adminRouter.post('/register', async (ctx) => {})
adminRouter.post('/login', async (ctx) => {})
adminRouter.post('/auth', async (ctx) => {})

module.exports = adminRouter
