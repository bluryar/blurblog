const KoaRouter = require('koa-router')

const adminRouter = new KoaRouter({
  prefix: '/user/admin'
})

adminRouter.post('/register', async (ctx) => {
  if (!ctx.is('application/json')) throw new global.HttpError(global.HttpError.UnsupportedMediaType)
  // 生成校验器
  const validator = new ctx.validators.AdminValidator(ctx.request.body)
  // 拦截器，如果输入参数不符合将会抛出错误，从而被外层中间件捕获
  if (validator.checkPayload('register') === true) {
    ctx.logger.warn(`user ip:  ${ctx.ip}`)
  } else ctx.throw(500) // 如果该语句触发说明程序发生了严重且隐蔽的异常

  ctx.body = { msg: '注册成功', code: 200, errorCode: 0 }
  ctx.status = 200
})
adminRouter.post('/login', async (ctx) => {})
adminRouter.post('/auth', async (ctx) => {})

module.exports = adminRouter
