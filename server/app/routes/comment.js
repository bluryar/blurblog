const KoaRouter = require('koa-router')

const commentRouter = new KoaRouter()

const isJson = require('./Middlewares/NAL-isJson')

/** 创建评论 */
commentRouter.post('/comment', isJson)

/** 删除评论 */
commentRouter.delete('/comment/:id')

/** 修改评论 */
commentRouter.put('/comment/:id', isJson)

/** 获取评论列表 */
commentRouter.get('/comment')

/** 获取评论详情 */
commentRouter.get('/comment/:id')

/** 获取文章下的评论 */
commentRouter.get('/article/:article_id/comments', isJson)

module.exports = commentRouter
