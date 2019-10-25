const mongoose = require('mongoose')

module.exports = async (ctx, next) => {
  if (!global.config) throw new Error('请先设置全局配置')
  const mongodbConfig = global.config.mongodb
  const url = `${mongodbConfig.urlPrefix}${mongodbConfig.host}:${mongodbConfig.port}`
  // 要实现一个http请求对应一次数据库连接，那么创建模型的时候，不能使用mongoose.model
  const db = mongoose.createConnection(url, mongodbConfig.mongoose)
  ctx.db = db
  global.logger.DATABASE.info(`DB:  ${mongodbConfig.mongoose.dbName}连接数据库`)
  try {
    await next()
  } catch (error) {
    db.close()
    db.once('disconnected', () => global.logger.DATABASE.info(`DB:  ${mongodbConfig.mongoose.dbName} 断开连接`))
    throw error
  }
  db.close()
  global.logger.DATABASE.info(`DB:  ${mongodbConfig.mongoose.dbName} 断开连接`)
}
