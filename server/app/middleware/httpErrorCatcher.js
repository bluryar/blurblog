const HttpError = require('../../lib/http-error')
const CustomError = require('../../lib/custom-error')
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
    // 捕获某些没能正确捕获的异常
    process.on('uncaughtException', (err) => {
      throw err
    })
    await next()
  } catch (error) {
    if (error instanceof HttpError) {
      // 说明该错误是已经描述了的http 4xx 错误

      // 除了404之外，都应该返回错误
      if (error.code !== HttpError.HTTP_CODE.NotFound) {
        ctx.logger.warn(error)
      }
      ctx.response.status = error.code
      ctx.body = {
        msg: error.msg,
        custom_code: error.customErrorCode
      }
    } else if (parseInt(error.status) === 401) {
      ctx.response.status = parseInt(error.status)
      ctx.body = {
        msg: error.msg,
        custom_code: CustomError.CUSTOM_ERROR_CODE.AuthFailed
      }
    } else {
      // 未知错误,设置为500
      ctx.response.status = HttpError.HTTP_CODE.InternalServerError
      ctx.body = {
        msg: HttpError.HTTP_MSG[HttpError.HTTP_CODE.InternalServerError],
        custom_code: CustomError.CUSTOM_ERROR_CODE.InternalServerError

      }
    }

    // 响应信息荷载
    ctx.body.payload = {
      request_body: ctx.request.body,
      request_method: ctx.method,
      request_url: ctx.URL.pathname
    }

    // 如果是非生产环境，就将错误栈输出
    if (process.env.NODE_ENV !== 'prod') {
      ctx.body.stack = error.stack
      if (error.nest_error) ctx.body.nest_error = error.nest_error
    }
  }
}
