const mongoose = require('mongoose')

module.exports = async (ctx, next) => {
  if (!global.config) throw new Error('请先设置全局配置')
  const mongodbConfig = global.config.mongodb
  const url = `${mongodbConfig.urlPrefix}${mongodbConfig.host}:${mongodbConfig.port}`
  // 打开数据库添加到请求上下文
  const DB = mongoose.createConnection(url, mongodbConfig.mongoose)
  DB.once('connected', () => global.logger.DATABASE.info(`DB:   ${url}   数据库连接成功`))

  await next()
  // 关闭数据库
  DB.close()
  DB.once('disconnected', () => global.logger.DATABASE.info(`DB:  ${mongodbConfig.mongoose.dbName} 断开连接`))
}
