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

  _checkTitle (_title) {
    const title = _title === undefined ? this.getStringValueByKey('title') : _title
    if (!this._.isString(title)) throw new HttpError(422, '参数类型错误', 1201)
    if (!this.StringValidator.isLength(title, {
      min: 3,
      max: 20
    })) throw new HttpError(422, '标题长度范围为3-20个字符', 1201)
    return true
  }

  _checkAuthor (_author) {
    const author = _author === undefined ? this.getStringValueByKey('author') : _author
    if (!this._.isString(author)) throw new HttpError(422, '参数类型错误', 1201)
    if (!this.StringValidator.isLength(author, {
      min: 3,
      max: 10
    })) throw new HttpError(422, '昵称长度范围为3-20个字符', 1201)
    return true
  }

  _checkContent (_content) {
    const content = _content === undefined ? this.getStringValueByKey('content') : _content
    if (!this._.isString(content)) throw new HttpError(422, '参数类型错误', 1201)
    if (!this.StringValidator.isLength(content, {
      min: 1,
      max: 20000
    })) throw new HttpError(422, '内容长度范围为1-20000个字符', 1201)
    return true
  }

  _checkCover (_cover) {
    const cover = _cover === undefined ? this.getStringValueByKey('cover') : _cover
    // 假设Cover是图片连接
    if (!this._.isString(cover)) throw new HttpError(422, '参数类型错误', 1201)
    return true
  }

  _checkCategory (_category) {
    const category = _category === undefined ? this.getStringValueByKey('category_id') : _category
    if (!this.StringValidator.isMongoId(category)) throw new HttpError(422, '参数分类 类型错误', 1201)
    return true
  }

  checkCtxParamsId (_id) {
    const id = _id === undefined ? this.requestPayload.id : _id
    if (!this._.isString(id)) throw new HttpError(400, '路由参数类型错误', 1201)
    if (!this.StringValidator.isMongoId(id)) throw new HttpError(400, '路由参数错误', 1201)
    return true
  }

  checkPutPayload () {
    if (this._.isEmpty(this.requestPayload)) throw new HttpError(400, '没有上传参数', 1201)
    if (this.requestPayload.id) throw new HttpError(422, '荷载参数不应包含id参数，请将id作为路径参数', 1201)
    // 状态模式，缓存对象
    const fn = {
      title: this._checkTitle,
      author: this._checkAuthor,
      cover: this._checkCover,
      content: this._checkContent,
      category_id: this._checkCategory
    }
    let result = true
    let isEmptyObject = true
    this._.forEach(this.requestPayload, (value, key) => {
      if (value === undefined) return
      if (this.StringValidator.isEmpty(value)) throw new HttpError(422, `${key}参数不能为空字符`, 1201)
      result = result && fn[key].call(this, value)
      isEmptyObject = false
    })
    if (isEmptyObject) throw new HttpError(400, '参数不能为空', 1201)
    return result
  }
}
