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
  NotAnError: 0, // 0表示没有错误
  BadRequest: 1001,
  AuthFailed: 1002,
  Forbidden: 1003,
  NotFound: 1004,
  MethodNotAllowed: 1005,
  UnsupportedMediaType: 1006,
  UnprocessableEntiey: 1007,
  InternalServerError: 1008,
  ValidateParamsFail: 1101,
  DaoValidatePropFail: 1201,
  AdminHasBeenExists: 1202,
  AdminNotExists: 1203,
  RouterMiddleWareLoadDao: 1301,
  RouterMiddleWareNameFault: 1302,
  MongooseSaveDocumentFile: 2001,
  MongooseFindDocumentFile: 2002,
  MongooseGetModelFail: 2101,
  MongooseGetDaoFail: 2201
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
