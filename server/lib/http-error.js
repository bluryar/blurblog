/**
 * @module http-error
 * @author Bluryar
 */

const reverseObject = require('./util/reverse-object')
const CustomError = require('./custom-error')

class HttpError extends Error {
  /**
   * @param {String} msg http状态信息
   * @param {Number} code http状态码
   * @param {Object} payload 自定义信息对象
   */
  constructor (code = 400, msg, customErrorCode = 0) {
    if (typeof code !== 'number') throw new TypeError('传入的http状态码应是number类型')
    if (customErrorCode && typeof customErrorCode !== 'number') throw new TypeError('传入的自定义错误码应是number类型')
    if (typeof code === 'number' && Object.values(HttpError.HTTP_CODE).indexOf(code) === -1) throw new Error('传入的http状态码尚未定义')
    super(msg)
    this.msg = msg || HttpError.HTTP_MSG[code]
    this.code = code
    this.customErrorCode = CustomError.CUSTOM_ERROR_CODE[this.msg]
  }
}
/**
 * 描述应用程序会可以处理的http错误，如果不在其中就会报错
 */
HttpError.HTTP_CODE = {
  BadRequest: 400,
  AuthFailed: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  UnsupportedMediaType: 415,
  UnprocessableEntiey: 422,
  InternalServerError: 500
}
/**
 * 描述http状态码对应的message,自动通过HTTP_CODE转换键值对获得
 */
HttpError.HTTP_MSG = reverseObject(HttpError.HTTP_CODE)

module.exports =
  /**
   * HTTP状态码
   * @class
   */
  HttpError
