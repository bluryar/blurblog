const WebValidator = require('./NAL-MixinValidator')(false)

const HttpError = global.HttpError
module.exports = class ArticleValidator extends WebValidator {
  constructor (requestPayload) {
    super(requestPayload)
    this.requestPayload = {
      ...{
        title: undefined,
        author: undefined,
        cover: undefined,
        content: undefined,
        category_id: undefined
      },
      ...requestPayload
    }
  }

  checkPayload () {
    if (this._.isEmpty(this.requestPayload)) throw new HttpError(400, '没有上传参数', 1201)
    this._.forEach(this.requestPayload, (value, key) => {
      if (value === undefined) throw new HttpError(400, `缺少参数${key}`, 1201)
      if (this.StringValidator.isEmpty(value)) throw new HttpError(422, `${key}参数不能为空字符`, 1201)
    })
    return this._checkTitle() && this._checkAuthor() &&
      this._checkContent() && this._checkCover() && this._checkCategory()
  }

  _checkTitle () {
    if (!this._.isString(this.requestPayload.title)) throw new HttpError(422, '参数类型错误', 1201)
    if (!this.StringValidator.isLength(this.requestPayload.title, {
      min: 3,
      max: 20
    })) throw new HttpError(422, '标题长度范围为3-20个字符', 1201)
    return true
  }

  _checkAuthor () {
    if (!this._.isString(this.requestPayload.author)) throw new HttpError(422, '参数类型错误', 1201)
    if (!this.StringValidator.isLength(this.requestPayload.author, {
      min: 3,
      max: 10
    })) throw new HttpError(422, '昵称长度范围为3-20个字符', 1201)
    return true
  }

  _checkContent () {
    if (!this._.isString(this.requestPayload.content)) throw new HttpError(422, '参数类型错误', 1201)
    if (!this.StringValidator.isLength(this.requestPayload.content, {
      min: 1,
      max: 20000
    })) throw new HttpError(422, '内容长度范围为1-20000个字符', 1201)
    return true
  }

  _checkCover () {
    // 假设Cover是图片连接
    if (!this._.isString(this.requestPayload.cover)) throw new HttpError(422, '参数类型错误', 1201)
    return true
  }

  _checkCategory () {
    if (!this.StringValidator.isMongoId(this.requestPayload.category_id)) throw new HttpError(422, '参数分类 类型错误', 1201)
    return true
  }
}
