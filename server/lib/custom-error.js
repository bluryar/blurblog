const reverseObject = require('./util/reverse-object')

class CustomError extends Error {
  /**
   * @param {String} msg 业务逻辑错误
   * @param {Number} code 业务逻辑错误代码
   * @param {Object} payload 自定义信息对象
   */
  constructor (msg = '未知错误', code = 9999, payload = {}) {
    super(msg)
    this.msg = msg
    this.code = code
    this.payload = payload
  }
}
/**
 * 1xxx为http错误码的别名
 */
CustomError.CUSTOM_ERROR_CODE = {
  BadRequest: 1001,
  AuthFailed: 1002,
  Forbidden: 1003,
  NotFound: 1004,
  MethodNotAllowed: 1005,
  UnsupportedMediaType: 1006,
  UnprocessableEntiey: 1007,
  InternalServerError: 1008,
  ValidateAdminParamsFail: 1101
}
/**
 * CUSTOM_ERROR_CODE的逆操作，讲其键名作为msg
 */
CustomError.CUSTOM_MSG = reverseObject(CustomError.CUSTOM_ERROR_CODE)

module.exports =
  /**
   * 业务逻辑
   * @class
   */
  CustomError
