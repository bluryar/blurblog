const KoaRouter = require('koa-router')

const adminRouter = new KoaRouter({
  prefix: '/user/admin'
})

// adminRouter.use(async (ctx, next) => {
//   // 传入数据库连接实例，获取 AdminDao静态类,将这个静态类挂载到ctx下
//   ctx.AdminDao = require('../../../lib/dao/user/AdminDao')(ctx.db)
//   await next()
// })

adminRouter.post('/register', async (ctx) => {
  if (!ctx.is('application/json')) throw new global.HttpError(global.HttpError.UnsupportedMediaType)

  // 生成校验器
  const validator = new ctx.validators.AdminValidator(ctx.request.body)

  // 拦截器，如果输入参数不符合将会抛出错误，从而被外层中间件捕获
  if (validator.checkPayload('register') === true) {
    global.logger.default.info(`user ip:  ${ctx.ip}`)
  } else ctx.throw(500) // 如果该语句触发说明程序发生了严重且隐蔽的异常

  // 创建管理员
  await ctx.AdminDao.createAdmin(ctx.request.body)

  ctx.body = {
    msg: '注册成功',
    code: 200,
    custom_code: 0
  }
  ctx.status = 200
})
adminRouter.post('/login', async (ctx) => {})
adminRouter.post('/auth', async (ctx) => {})

module.exports = adminRouter
