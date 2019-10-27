const WebValidator = require('./NAL-MixinValidator')(false)

const HttpError = global.HttpError
module.exports = class CategoryValidator extends WebValidator {
  constructor (requestPayload) {
    super(requestPayload)
    this.requestPayload = {
      ...{
        name: undefined,
        key: undefined,
        parent_id: undefined
      },
      ...requestPayload
    }
    this.baseCheck = {
      // 分类名
      _checkName: (_name) => {
        const result = this._.isString(_name) &&
          this.StringValidator.isLength(_name, { min: 1, max: 20 })
        if (!result) throw new HttpError(400, '请确认name参数为1-20个字符的字符串')
        else return result
      },
      // 分类关键字
      _checkKey: (_key) => {
        const result = this._.isString(_key) &&
        this.StringValidator.isLength(_key, { min: 1, max: 20 })
        if (!result) throw new HttpError(400, '请确认key参数为1-20个字符的字符串')
        else return result
      },
      // 父分类id
      _checkParentId: (_parentId) => {
        const result = this._.isString(_parentId) &&
          this.StringValidator.isLength(_parentId, { min: 24, max: 24 })
        if (!result) throw new HttpError(400, '请确认parent_id参数为24个字符的字符串')
        if (!this.StringValidator.isMongoId(_parentId)) throw new HttpError(400, '参数id错误')
        return true
      }
    }
  }

  checkPayload (_payload) {
    const payload = this._.isUndefined(_payload) ? this.requestPayload : _payload
    if (this._.isUndefined(payload) || this._.isEmpty(payload)) throw new HttpError(400, '表单参数为空')
    if (this._.isUndefined(payload.name) || this._.isUndefined(payload.key)) throw new HttpError(400, 'name or key undefined')

    let result = this._.isUndefined(payload.parent_id) ? true : this.baseCheck._checkParentId(payload.parent_id)
    result = result && this.baseCheck._checkName(payload.name) &&
    this.baseCheck._checkKey(payload.key)
    return result
  }

  checkParams (_params) {
    if (this._.isUndefined(_params) || this._.isEmpty(_params) || !this._.isString(_params)) throw new HttpError(400, '请传入非空路径参数')
    if (!this.StringValidator.isMongoId(_params)) throw new HttpError('路径参数许是正式id值')
    return true
  }

  checkPutPayload (_payload) {
    if (this._.isUndefined(_payload) || this._.isEmpty(_payload)) throw new HttpError(400, '不能对接口进行空荷载更新')
    const nameStatus = this._.isUndefined(_payload.name) ? true : this.baseCheck._checkName(_payload.name)
    const keyStatus = this._.isUndefined(_payload.key) ? true : this.baseCheck._checkKey(_payload.key)
    const parentIdStatus = this._.isUndefined(_payload.parent_id) ? true : this.baseCheck._checkParentId(_payload.parent_id)
    return nameStatus && keyStatus && parentIdStatus
  }
}
