const KoaRouter = require('koa-router')

const adminRouter = new KoaRouter({
  prefix: '/user/admin'
})

adminRouter.post('/register', async (ctx) => {
  if (!ctx.is('application/json')) throw new global.HttpError(global.HttpError.UnsupportedMediaType)
  // 校验参数
  const validator = new ctx.validators.AdminValidator(ctx.request.body)
  validator.checkPayload('register') // 拦截器，如果输入参数不符合将会抛出错误

  ctx.body = { msg: '注册成功', code: 200, errorCode: 0 }
  ctx.status = 200
})
adminRouter.post('/login', async (ctx) => {})
adminRouter.post('/auth', async (ctx) => {})

module.exports = adminRouter
