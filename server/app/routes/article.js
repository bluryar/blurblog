const KoaRouter = require('koa-router')

const articleRouter = new KoaRouter()

const isJson = require('./Middlewares/NAL-isJson')

/**
 * 创建文章
 */
articleRouter.post('/article', isJson, async (ctx) => {
  // 获取参数校验器
  const validator = new ctx.validators.ArticleValidator(ctx.request.body)
  if (validator.checkPayload()) {
    global.logger.CUSTOM_INFO.info('/article接口校验参数成功')
  }

  await ctx.ArticleDao.createArticle(ctx.request.body)

  ctx.status = 200
  ctx.body = {
    msg: '创建文章成功',
    code: 200,
    custom_code: 0
  }
})

/**
 *删除文章
 */
articleRouter.delete('/article/:id', async (ctx) => {
  // 校验参数
  const validator = new ctx.validators.ArticleValidator(ctx.params)
  if (validator.checkCtxParamsId(ctx.params.id)) global.logger.CUSTOM_INFO.info(`路由参数 ${ctx.params.id} 校验成功`)

  // 查询数据库
  await ctx.ArticleDao.findAndDeleteById(ctx.params.id)

  ctx.status = 200
  ctx.body = {
    msg: '删除文章成功',
    code: 200,
    custom_code: 0
  }
})

/**
 * 修改某一篇文章
 */
articleRouter.put('/article/:id', isJson, async (ctx) => {
  // 校验参数--id
  const validator = new ctx.validators.ArticleValidator(ctx.request.body)
  if (validator.checkCtxParamsId(ctx.params.id)) global.logger.CUSTOM_INFO.info(`路由参数 ${ctx.params.id} 校验成功`)
  if (validator.checkPutPayload()) {
    global.logger.CUSTOM_INFO.info('荷载参数 校验成功')
  }

  // 参数校验成功，进行数据库操作

  await ctx.ArticleDao.updateArticleById(ctx.request.body, ctx.params.id)

  ctx.status = 200
  ctx.body = {
    msg: '更新文章成功',
    code: 200,
    custom_code: 0
  }
})

/**
 * 获取文章列表
 */
articleRouter.get('/article', isJson, async (ctx) => {
  // 校验参数
  const validator = new ctx.validators.ArticleValidator()
  const afterValidateParams = validator.checkQueryAndPayload(ctx.request.query, ctx.request.body)
  if (afterValidateParams) { global.logger.CUSTOM_INFO.info(`路由参数 ${ctx.params.id} 校验成功`) }

  // 查询数据库,取得文章信息、分类信息、评论信息列表（包含评论数组、元信息）
  const articles = await ctx.ArticleDao.findPageDescArticle(afterValidateParams)
  global.logger.CUSTOM_INFO.info('数据查找成功')

  // TODO 完成Dao，取消掉 `{} ||`
  // const category = {} || await ctx.CategoryDao.findCategoryById(article.category_id)
  // const comments = {} || await ctx.CommentDao.findCommentsById(article.article_id)

  ctx.status = 200
  ctx.body = {
    msg: 'success',
    code: 200,
    custom_code: 0,
    data: {
      data:
        articles.data, // category_detail: category, // TODO 获取分类信息
      // comments_list: { // TODO 获取评论列表
      //   data: comments.data,
      //   meta: comments.meta
      // }

      meta: articles.meta
    }
  }
})

/**
 * 获取某一篇文章的详情
 */
articleRouter.get('/article/:id', async (ctx) => {
  // 校验参数
  const validator = new ctx.validators.ArticleValidator()
  if (validator.checkCtxParamsId(ctx.params.id)) global.logger.CUSTOM_INFO.info(`路由参数 ${ctx.params.id} 校验成功`)

  // 查询数据库,取得文章信息、分类信息、评论信息列表（包含评论数组、元信息）
  const article = await ctx.ArticleDao.findOneArticleById(ctx.params.id)

  // TODO 完成Dao，取消掉 `{} ||`
  const category = {} || await ctx.CategoryDao.findCategoryById(article.category_id)
  const comments = {} || await ctx.CommentDao.findCommentsById(article.article_id)

  ctx.status = 200
  ctx.body = {
    msg: 'success',
    code: 200,
    custom_code: 0,
    data: {
      ...article,
      category_detail: category, // TODO 获取分类信息
      comments_list: { // TODO 获取评论列表
        data: comments.data,
        meta: comments.meta
      }
    }
  }
})

/**
 *搜索文章
 */
articleRouter.get('/search/article', isJson, async (ctx) => {
  // 校验参数
  const validator = new ctx.validators.ArticleValidator()
  const afterValidateParams =
    validator.ensureSearch(ctx.request.query, ctx.request.body) &&
    validator.checkQueryAndPayload(ctx.request.query, ctx.request.body)
  if (afterValidateParams) { global.logger.CUSTOM_INFO.info(`路由参数 ${ctx.params.id} 校验成功`) }

  // 查询数据库,取得文章信息、分类信息、评论信息列表（包含评论数组、元信息）
  const articles = await ctx.ArticleDao.findPageDescArticle(afterValidateParams)
  global.logger.CUSTOM_INFO.info('数据查找成功')

  // TODO 完成Dao，取消掉 `{} ||`
  // const category = {} || await ctx.CategoryDao.findCategoryById(article.category_id)
  // const comments = {} || await ctx.CommentDao.findCommentsById(article.article_id)

  ctx.status = 200
  ctx.body = {
    msg: 'success',
    code: 200,
    custom_code: 0,
    data: {
      data:
        articles.data, // category_detail: category, // TODO 获取分类信息
      // comments_list: { // TODO 获取评论列表
      //   data: comments.data,
      //   meta: comments.meta
      // }

      meta: articles.meta
    }
  }
})

module.exports = articleRouter
