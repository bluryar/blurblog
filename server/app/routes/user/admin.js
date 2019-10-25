const KoaRouter = require('koa-router')

const jsonwebtoken = require('jsonwebtoken')

const jsJson = require('../Middlewares/NAL-isJson')

const adminRouter = new KoaRouter({
  prefix: '/user/admin'
})

adminRouter.post('/register', jsJson, async (ctx) => {
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
adminRouter.post('/login', jsJson, async (ctx) => {
  if (!ctx.is('application/json')) throw new global.HttpError(global.HttpError.UnsupportedMediaType)

  // 生成校验器
  const validator = new ctx.validators.AdminValidator(ctx.request.body)

  // 拦截器，如果输入参数不符合将会抛出错误，从而被外层中间件捕获
  if (validator.checkPayload('login') === true) {
    global.logger.CUSTOM_INFO.info(`用户 ${ctx.request.body.email} 登录输入通过HTTP参数校验`)
  } else ctx.throw(500) // 如果该语句触发说明程序发生了严重且隐蔽的异常

  if (await ctx.AdminDao.checkPassword(ctx.request.body) === true) {
    global.logger.CUSTOM_INFO.warn(`用户 ${ctx.request.body.email} 登录输入通过Dao查询确定数据库中存在该用户`)
  }

  const {
    secretKey,
    expiresIn,
    issuer
  } = global.config.security
  // TODO 生成token
  const token = jsonwebtoken.sign({
    email: ctx.request.body.email
  }, secretKey, {
    expiresIn,
    issuer
  })
  global.logger.CUSTOM_INFO.warn(`为用户${ctx.request.body.email}(代理ip:${ctx.ip}) 提供存活时间为一个小时的token${token}`)
  ctx.status = 200
  ctx.body = {
    msg: '登陆成功',
    token
  }
})
adminRouter.get('/auth', async (ctx) => {
  // 访问该接口需要鉴权，如果这个异步函数被执行，说明鉴权成功
  const {
    email
  } = ctx.state.user
  const admin = await ctx.AdminDao.findAdminByEmail(email)
  ctx.status = 200
  ctx.body = {
    msg: 'success',
    custom_code: 0,
    data: {
      id: admin.id,
      nickname: admin.nickname,
      email: admin.email
    }
  }
})

module.exports = adminRouter
