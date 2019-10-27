const KoaRouter = require('koa-router')

const categoryRouter = new KoaRouter()
const isJson = require('./Middlewares/NAL-isJson')

/** 创建分类 */
categoryRouter.post('/category', isJson, async (ctx) => {
  const payload = ctx.request.body

  const validator = new ctx.validators.CategoryValidator()
  // 校验参数
  if (validator.checkPayload(payload)) { global.logger.default.info('POST /category：参数校验成功') }

  // 数据库交互
  await ctx.CategoryDao.createCategory(payload)
  global.logger.default.info('POST /category：数据库交互完成')

  ctx.status = 200
  ctx.body = {
    msg: '创建分类成功',
    code: 200,
    custom_code: 0
  }
})

/** 删除分类 */
categoryRouter.delete('/category/:id', async (ctx) => {
  const params = ctx.params.id

  // 校验参数
  const validator = new ctx.validators.CategoryValidator()
  if (validator.checkParams(params)) { global.logger.default.info('DELETE /category/:id：参数校验成功') }

  // 数据库交互
  await ctx.CategoryDao.deleteCategory(params)
  global.logger.DATABASE.info('DELETE /category/:id：删除成功')
  ctx.status = 200
  ctx.body = {
    msg: '删除分类成功',
    code: 200,
    custom_code: 0
  }
})

/** 更新分类 */
categoryRouter.put('/category/:id', isJson, async (ctx) => {
  const params = ctx.params.id
  const payload = ctx.request.body

  // 校验参数
  const validator = new ctx.validators.CategoryValidator()
  if (validator.checkParams(params) && validator.checkPutPayload(payload)) { global.logger.default.info('PUT /category/:id：参数校验成功') }

  // 数据库交互
  await ctx.CategoryDao.updateCategory(params, payload)
  global.logger.default.info('PUT /category/:id：更新成功')
  ctx.status = 200
  ctx.body = {
    msg: '更新分类成功',
    code: 200,
    custom_code: 0
  }
})

/** 获取所有分类 */
categoryRouter.get('/category', async (ctx) => {
  // 不需要校验参数

  // 数据库交互
  const result = await ctx.CategoryDao.findAllCategory()
  if (!(result instanceof Array)) throw new Error('查找分类结果不是数组')

  const data = []
  for (let i = 0; i < result.length; i++) {
    data[i] = result[i].toObject()
    data[i].article_nums = await ctx.ArticleDao.countArticleByCategoryId(result[i].id)
  }

  ctx.status = 200
  ctx.body = {
    code: 200,
    msg: 'success',
    custom_code: 0,
    data
  }
})

/** 获取分类详情 */
categoryRouter.get('/category/:id', async (ctx) => {
  // 校验路径参数
  const validator = new ctx.validators.CategoryValidator()
  if (validator.checkParams(ctx.params.id)) { global.logger.default.info('PUT /category/:id：参数校验成功') }

  // 与数据库交互
  const result = await ctx.CategoryDao.findCategoryById(ctx.params.id)
  const count = await ctx.ArticleDao.countArticleByCategoryId(ctx.params.id)
  const data = {
    ...(result.toObject()),
    article_nums: count
  }

  ctx.status = 200
  ctx.body = {
    code: 200,
    msg: 'success',
    custom_code: 0,
    data
  }
})

/** 获取一个分类下的文章 */
categoryRouter.get('/category/:id/article', isJson)

module.exports = categoryRouter
