/**
 * http状态码类，主要用于获取4xx（客户端错误）状态码对应的类。
 * @module httpErrorList
 */

/**
 * 默认错误类，同时也是其余http错误类的父类，可以用于检测错误是否为http错误
 * @extends {Error}
 */
class HttpError extends Error {
  constructor (msg = '未知错误', code = 400, errCode = 10000) {
    super()
    this.msg = msg
    this.code = code
    this.errCode = errCode
  }
}

/**
 * 400 Bad Request
 *
 * 1、语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。
 *
 * 2、请求参数有误。
 * @extends {HttpError}
 */
class BadRequest extends HttpError {
  constructor (msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

/**
 * 401 Unauthorized
 *
 * 当前请求需要用户验证。
 * @extends {HttpError}
 */
class AuthFailed extends HttpError {
  constructor (msg, errorCode) {
    super()
    this.code = 401
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
  }
}
/**
 * 403 Forbidden
 *
 * 服务器已经理解请求，但是拒绝执行它。
 *
 * 与 401 响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个 HEAD 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个 404 响应，假如它不希望让客户端获得任何信息。
 * @extends {HttpError}
 */
class Forbidden extends HttpError {
  constructor (msg, errorCode) {
    super()
    this.code = 403
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 10006
  }
}

/**
 * 请求失败，请求所希望得到的资源未被在服务器上发现。
 *
 * 没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下。
 * @extends {HttpError}
 */
class NotFound extends HttpError {
  constructor (msg, errorCode) {
    super()
    this.code = 404
    this.msg = msg || '404找不到'
    this.errorCode = errorCode || 10005
  }
}
/**
 * 请求行中指定的请求方法不能被用于请求相应的资源。
 *
 * 该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。 鉴于 PUT，DELETE 方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回405错误。
 * @extends {HttpError}
 */
class MethodNotAllowed extends HttpError {
  constructor (msg, errorCode) {
    super()
    this.code = 405
    this.msg = msg || '405请求方法不能被用于请求相应的资源'
    this.errorCode = errorCode || 10005
  }
}

/**
 * 对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝。
 * @extends {HttpError}
 */
class UnsupportedMediaType extends HttpError {
  constructor (msg, errorCode) {
    super()
    this.code = 415
    this.msg = msg || '不受支持的媒体类型'
    this.errorCode = errorCode || 10006
  }
}
/**
 * 请求格式良好，但由于语义错误而无法遵循。
 * @extends {HttpError}
 */
class UnprocessableEntiey extends HttpError {
  constructor (msg, errorCode) {
    super()
    this.code = 422
    this.msg = msg || '参数格式正确,能理解实体内容但不是目标实体，因此无法处理'
    this.errorCode = errorCode || 10006
  }
}
/**
 * HTTP状态码类工厂
 * @param {Number} status http状态码
 * @returns {(BadRequest|AuthFailed|Forbidden|NotFound|MethodNotAllowed|UnsupportedMediaType|UnprocessableEntiey)} HTTP状态码类
 */
function httpErrCodeFactory (status) {
  switch (status) {
    case 400:
      return BadRequest
    case 401:
      return AuthFailed
    case 403:
      return Forbidden
    case 404:
      return NotFound
    case 405:
      return MethodNotAllowed
    case 415:
      return UnsupportedMediaType
    case 422:
      return UnprocessableEntiey
    default:
      return new Error('参数错误，或者还没有添加这种状态码')
  }
}

module.exports = {
  /**
   * 这个模块的基类，当错误发生时，可以用这个类做父类检测这个错误是否为http错误
   */
  HttpError,
  /**
   * 一个抽象类工厂，通过输入对应的状态码来获取错误类
   */
  httpErrCodeFactory
}
