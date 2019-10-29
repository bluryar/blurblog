const getXxxDaoArr = require('../../../lib/dao') // 引入方法数组

module.exports = async (ctx, next) => {
  // ctx.db 要求必须存在
  if (ctx.db === undefined) throw (new global.HttpError(500, '中间件顺序错误', 1301)).nestAnErrorTo500(new Error('开发信息: loadDao中间件必须在dbConnect之后传入'))
  // getXxxDao.name 要求必须满足getXxxDao
  getXxxDaoArr.forEach(getXxxDao => {
    if (!getXxxDao.name.match(/^get(\w+)Dao$/)) { throw new global.HttpError(500, 'getXxxDao方法名字错误', 1302) }
    ctx[getXxxDao.name.split('get')[1]] = getXxxDao(ctx.db)
  })
  await next()
}
/**
 * 这个中间件主要是为了加载 XxxDao 到ctx中
 */
