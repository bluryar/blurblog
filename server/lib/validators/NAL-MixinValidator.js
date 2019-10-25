const validator = require('validator')
const _ = require('lodash')

module.exports = (function () {
  class MixinValidator {
    constructor () {
      this.StringValidator = validator
      this._ = _
    }

    getStringValueByKey (key) {
      if (key === undefined || !this.requestPayload[key]) throw new global.HttpError(400, `${key} 不存在`, 1101) // 400
      const value = this.requestPayload[key]
      if (!this._.isString(value)) throw new global.HttpError(422, `${key} 应该传入String`, 1101) // 422
      return value
    }
  }
  class WebValidator extends MixinValidator {
    constructor (payload) {
      super()
      if (_.isObject(payload)) {
        this.payload = payload
      } else {
        throw new TypeError('payload需是一个对象')
      }
    }
  }
  class MongooseValidator extends MixinValidator {
    constructor (payload) {
      super()
      this.payload = payload
    }
  }
  return function (isMongoose) {
    if (isMongoose === undefined) throw new TypeError('isMongoose 是必填布尔值(typeof Boolean)')
    if (isMongoose) return MongooseValidator
    else return WebValidator
  }
})()
