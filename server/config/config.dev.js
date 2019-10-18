module.exports = {
  NODE_ENV: 'dev',
  port: 3000,
  baseDIR: process.cwd(),
  redis: {
    host: '127.0.0.1',
    port: 6397,
    pass: ''
  },
  mongodb: {
    urlPrefix: 'mongodb://',
    host: '127.0.0.1',
    port: 27017,
    mongoose: {
      user: '',
      pass: '',
      dbName: 'blurblog@DEV',
      poolize: 5, // mongodb默认为5
      promiseLibary: Promise, // Promise库设置为ES6的Promise
      bufferCommands: false, // 要求mongoose 不缓存命令
      bufferMaxEntries: 0,
      useCreateIndex: true, // use createIndex() instead of ensureIndex()
      useNewUrlParser: true, // 使用新的解析器必须在连接字符串中指定端口
      connectTimeoutMS: 5000 // 最大空闲连接时间，如果在这个时间内没有活动就关闭连接
    }
  }
}
