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
    global.logger.CUSTOM_INFO.info(`用户 ${ctx.request.body.email} 注册输入正常`)
  } else ctx.throw(500) // 如果该语句触发说明程序发生了严重且隐蔽的异常

  // 创建管理员，同时检测是否已经存在一个同样信息的管理员
  await ctx.AdminDao.createAdmin(ctx.request.body)

  ctx.body = {
    msg: '注册成功',
    code: 200,
    custom_code: 0
  }
  ctx.status = 200

  global.logger.CUSTOM_INFO.info(`用户 ${ctx.request.body.email} 注册成功`)
})
adminRouter.post('/login', async (ctx) => {
  if (!ctx.is('application/json')) throw new global.HttpError(global.HttpError.UnsupportedMediaType)

  // 生成校验器
  const validator = new ctx.validators.AdminValidator(ctx.request.body)

  // 拦截器，如果输入参数不符合将会抛出错误，从而被外层中间件捕获
  if (validator.checkPayload('login') === true) {
    global.logger.CUSTOM_INFO.info(`用户 ${ctx.request.body.email} 登录输入通过HTTP参数校验`)
  } else ctx.throw(500) // 如果该语句触发说明程序发生了严重且隐蔽的异常

  if (await ctx.AdminDao.checkPassword(ctx.request.body) === true) {
    global.logger.CUSTOM_INFO.info(`用户 ${ctx.request.body.email} 登录输入通过Dao查询确定数据库中存在该用户`)
  }

  // TODO 生成token

  ctx.status = 200
})
adminRouter.post('/auth', async (ctx) => {})

module.exports = adminRouter
