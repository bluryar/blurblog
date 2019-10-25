const KoaRouter = require('koa-router')

const categoryRouter = new KoaRouter()
const isJson = require('./Middlewares/NAL-isJson')

/** 创建分类 */
categoryRouter.post('/category', isJson)

/** 删除分类 */
categoryRouter.delete('/category/:id')

/** 更新分类 */
categoryRouter.put('/category/:id', isJson)

/** 获取所有分类 */
categoryRouter.get('/category')

/** 获取分类详情 */
categoryRouter.get('/category/:id')

/** 获取一个分类下的文章 */
categoryRouter.get('/category/:id/article', isJson)

module.exports = categoryRouter
