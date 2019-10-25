const KoaRouter = require('koa-router')

const articleRouter = new KoaRouter()

articleRouter.post('/article', async (ctx) => {
  // 获取参数校验器
  const validator = new ctx.validators.ArticleValidator(ctx.request.body)
  if (validator.checkPayload()) { global.logger.CUSTOM_INFO.info('/article接口校验参数成功') }

  await ctx.ArticleDao.createArticle(ctx.request.body)

  ctx.status = 200
  ctx.body = {
    msg: '创建文章成功',
    code: 200,
    custom_code: 0
  }
})

module.exports = articleRouter
