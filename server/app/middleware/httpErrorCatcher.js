const HttpError = require('../../lib/http-error')
/**
 * @todo 1、添加日志？
 * @todo 2、处理业务逻辑错误
 */
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
    if (process.env.NODE_ENV === 'prod') {
      if (error instanceof HttpError) {
        // 说明该错误是已经描述了的http 4xx 错误
        ctx.response.status = error.code
        ctx.body = {
          msg: error.msg,
          custom_code: error.customErrorCode
        }
      } else {
        // 未知错误
        ctx.response.status = HttpError.HTTP_CODE.InternalServerError
        ctx.body = {
          msg: HttpError.HTTP_MSG[HttpError.HTTP_CODE.InternalServerError],
          custom_code: 1008
        }
      }
    } else { // 开发、测试等环境下之间返回堆栈信息
      ctx.throw(error.code, error.msg, {
        custom_code: error.customErrorCode,
        stack: error.stack
      })
    }
  }
}
