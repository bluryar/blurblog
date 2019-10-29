const WebValidator = require('./NAL-MixinValidator')(false)

const HttpError = global.HttpError
module.exports = class CommentValidator extends WebValidator {
  constructor (requestPayload) {
    super(requestPayload)
    this.requestPayload = {
      ...{
        nickname: undefined,
        email: undefined,
        content: undefined,
        article_id: undefined,
        parent_id: undefined
      },
      ...requestPayload
    }
    this.baseCheck = {
      // 昵称
      _checkNickname: (_nickname) => {
        const result = this._.isString(_nickname) &&
          this.StringValidator.isLength(_nickname, { min: 3, max: 10 })
        if (!result) throw new HttpError(400, '请确认昵称为3-10个字符的字符串')
        else return result
      },
      // 邮件
      _checkEmail: (_email) => {
        const result = this._.isString(_email) &&
          this.StringValidator.isEmail(_email)
        if (!result) throw new HttpError(400, '邮箱格式错误')
        else return result
      },
      // 文章id
      _checkArticleId: (_articleId) => {
        const result = this._.isString(_articleId) &&
          this.StringValidator.isMongoId(_articleId)
        if (!result) throw new HttpError(400, 'id形式错误')
        else return result
      },

      // 内容
      _checkContent: (_content) => {
        const result = this._.isString(_content)
        if (!result) throw new HttpError(400, '请确认内容为字符串')
        else return result
      },

      // 父评论id
      _checkParentId: (_parentId) => {
        const result = this._.isString(_parentId) &&
          this.StringValidator.isMongoId(_parentId)
        if (!result) throw new HttpError(400, 'id形式错误')
        else return result
      }
    }
  }

  checkParams (_params) {
    if (this._.isUndefined(_params) || this._.isEmpty(_params) || !this._.isString(_params)) throw new HttpError(400, '请传入非空路径参数')
    if (!this.StringValidator.isMongoId(_params)) throw new HttpError(400, '路径参数必须是id值')
    return true
  }

  checkPayload (_payload) {
    if (this._.isEmpty(_payload) || !this._.isPlainObject(_payload)) throw new Error('请确保传入的payload非空，并且是一个对象')
    const fn = {
      nickname: this.baseCheck._checkNickname,
      email: this.baseCheck._checkEmail,
      content: this.baseCheck._checkContent,
      article_id: this.baseCheck._checkArticleId,
      parent_id: this.baseCheck._checkParentId
    }
    this._.forEach(_payload, (value, key) => {
      if (key === 'parent_id' && this._.isUndefined(value)) return
      if (this._.isUndefined(value)) throw new HttpError(400, `缺少${key}参数`)
      fn[key].call(this, value)
    })
    return true
  }

  checkPutPayload (_payload) {
    const fn = {
      nickname: this.baseCheck._checkNickname,
      email: this.baseCheck._checkEmail,
      content: this.baseCheck._checkContent,
      article_id: this.baseCheck._checkArticleId,
      parent_id: this.baseCheck._checkParentId
    }
    this._.forEach(_payload, (value, key) => {
      if (this._.isUndefined(value)) return // 即参数是可选的
      fn[key].call(this, value)
    })
    return true
  }

  checkPage (page) {
    if (this._.isUndefined(page) || !this._.isString(page)) throw new HttpError(400, 'page必须存在且是字符串')
    if (!this.StringValidator.isInt(page)) throw new HttpError(400, 'page必须是整型字符串形式')
    return true
  }

  checkDesc (desc) {
    if (this._.isUndefined(desc)) throw new HttpError(400, 'desc未指定')
    if (this._.isPlainObject(desc) && this._.isEmpty(desc)) throw new HttpError(400, 'desc不能为空')
    if (!this._.isUndefined(desc.created_at) && !this._.isBoolean(desc.created_at)) throw new HttpError(400, 'created_at被指定，但是类型错误')
    if (!this._.isUndefined(desc.browse) && !this._.isBoolean(desc.browse)) throw new HttpError(400, '按browse排序模式被指定，但是类型错误')
    return true
  }
}
