const KoaRouter = require('koa-router')

const commentRouter = new KoaRouter()

const isJson = require('./Middlewares/NAL-isJson')

const validateLog = (ctx) => { global.logger.default.info(`${ctx.method} ${ctx.path}: 参数校验成功`) }
/** 创建评论 */
commentRouter.post('/comment', isJson, async (ctx) => {
  const validator = new ctx.validators.CommentValidator()
  if (validator.checkPayload(ctx.request.body)) validateLog(ctx)

  await ctx.CommentDao.createComment(ctx.request.body)

  ctx.status = 200
  ctx.body = {
    msg: '创建评论成功',
    code: 200,
    custom_code: 0
  }
})

/** 删除评论 */
commentRouter.delete('/comment/:id', async (ctx) => {
  const validator = new ctx.validators.CommentValidator()
  if (validator.checkParams(ctx.params.id)) validateLog(ctx)

  await ctx.CommentDao.deleteComment(ctx.params.id)

  ctx.status = 200
  ctx.body = {
    msg: '删除评论成功',
    code: 200,
    custom_code: 0
  }
})

/** 修改评论 */
commentRouter.put('/comment/:id', isJson, async (ctx) => {
  const validator = new ctx.validators.CommentValidator()
  if (validator.checkParams(ctx.params.id)) validateLog(ctx)

  await ctx.CommentDao.updateComment(ctx.params.id, ctx.request.body)

  ctx.status = 200
  ctx.body = {
    msg: '更新评论成功',
    code: 200,
    custom_code: 0
  }
})

/** 获取评论列表 */
commentRouter.get('/comment', async (ctx) => {
  const validator = new ctx.validators.CommentValidator()
  const page = ctx.request.query.page
  if (validator.checkPage(page)) validateLog(ctx)
  const results = await ctx.CommentDao.findAllComment(page)

  ctx.status = 200
  ctx.body = {
    msg: 'success',
    code: 200,
    custom_code: 0,
    data: results
  }
})

/** 获取评论详情 */
commentRouter.get('/comment/:id', async (ctx) => {
  const validator = new ctx.validators.CommentValidator()
  if (validator.checkParams(ctx.params.id)) validateLog(ctx)

  const result = await ctx.CommentDao.findOneComment(ctx.params.id)

  ctx.status = 200
  ctx.body = {
    msg: 'success',
    code: 200,
    custom_code: 0,
    data: result
  }
})

/** 获取文章下的评论 */
commentRouter.get('/article/:article_id/comments', isJson, async (ctx) => {
  const validator = new ctx.validators.CommentValidator()
  if (validator.checkParams(ctx.params.article_id)) validateLog(ctx)
  if (ctx.request.body.desc !== undefined) validator.checkDesc(ctx.request.body.desc)
  if (ctx.request.body.page !== undefined) validator.checkPage(ctx.request.body.page)

  const result = await ctx.CommentDao.findCommentsByArticleId(ctx.params.article_id, ctx.request.body.page, ctx.request.body.desc)

  ctx.status = 200
  ctx.body = {
    code: 200,
    msg: 'success',
    custom_code: 0,
    data: result
  }
})

module.exports = commentRouter
