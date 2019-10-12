/**
 * 全局HTTP异常捕获处理，描述对捕获到的HTTP异常的处理方法。
 * 例如在开发环境下，仅仅将异常打印在控制台，而在生产环境下，
 * 将异常通过http服务返回。或者开发环境下，暴露更多的错误细节给接口
 *
 * 注意抛出的异常需要解析（因为这些异常都是NODEjs的Error子类实例，而非http异常），
 * 然后通过ctx返回给接口
 */
module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // TODO
  }
}
