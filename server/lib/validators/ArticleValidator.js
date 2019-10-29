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

  /**
   * 校验Query和Payload
   * @param {Object} query 查询字符对象
   * @param {Object} payload 请求荷载参数
   */
  checkQueryAndPayload (query, payload) {
    // 这两个参数，只要非空，必须是对象
    if ((!this._.isUndefined(query) && !this._.isPlainObject(query)) ||
      (!this._.isUndefined(payload) && !this._.isPlainObject(payload))
    ) {
      throw new TypeError('query和payload自能是undefined或者对象')
    }
    // 参数优先级:荷载参数>路径查询字段>默认参数值
    const params = {
      ...{ // 默认配置
        page: '1',
        desc: {
          created_at: true, // 默认按日期排序 降序
          browse: false
        },
        category_id: '*', // 分类id
        keyword: undefined // 搜索关键字
      },
      ...query,
      ...payload
    }
    // 状态模式，缓存对象
    const fn = {
      page: this._checkPage,
      desc: this._checkDesc,
      category_id: this._checkCategoryId, // 分类id
      keyword: this._checkKeyword // 搜索关键字
    }
    const result = true
    this._.forEach(params, (value, key) => {
      // 如果关键属性未定义，就跳过
      if (!fn[key] || this._.isUndefined(params[key])) return // 无视除了关键属性外的属性
      result && fn[key].call(this, value)
    })
    return params
  }

  _checkPage (_page) {
    if (!this._.isString(_page)) throw new HttpError(400, '参数page 类型错误')
    if (!this.StringValidator.isInt(_page)) throw new HttpError(400, '参数page 类型错误')
    if (parseInt(_page) < 1) throw new HttpError(422, '参数page 大于0')
    return true
  }

  _checkDesc (_desc) {
    if (!this._.isPlainObject(_desc)) throw new HttpError(400, '参数desc必须是一个对象')
    if (this._.isUndefined(_desc.created_at) || this._.isUndefined(_desc.browse)) throw new Error('desc由两个属性组成 created_at\browse') // 内部错误
    if (!this._.isBoolean(_desc.created_at) || !this._.isBoolean(_desc.browse)) throw new HttpError(400, '参数desc的两个属性都只能是布尔值')
    if (_desc.created_at && _desc.browse) throw new HttpError(422, '只能发布日期和浏览数中的一个排序')
    return true
  }

  _checkCategoryId (_categoryId) {
    if (!this._.isString(_categoryId)) throw new HttpError(400, '参数category_id必须是一个字符串')
    if (_categoryId === '*') return true
    if (!this.StringValidator.isMongoId(_categoryId)) throw new HttpError(400, 'category_id有误')
    return true
  }

  _checkKeyword (_keyword) {
    if (!this._.isString(_keyword)) throw new HttpError(400, '参数keyword必须是一个字符串')
    if (!this.StringValidator.isLength(_keyword, {
      min: 1,
      max: 50
    })) throw new HttpError(422, 'keyword 长度在1-50个字符')
    return true
  }

  _ensureCategoryIdUndefined (params) {
    if (!this._.isUndefined(params.category_id)) throw new HttpError(400, '搜索接口不能有category_id值')
    return true
  }

  _ensureKeywordDefined (params) {
    if (this._.isUndefined(params.keyword)) throw new HttpError(400, '必须传入keyword')
    return true
  }

  ensureSearch (query, payload) {
    // 这两个参数，只要非空，必须是对象
    if ((!this._.isUndefined(query) && !this._.isPlainObject(query)) ||
      (!this._.isUndefined(payload) && !this._.isPlainObject(payload))
    ) {
      throw new TypeError('query和payload只能是undefined或者对象')
    }
    // 参数优先级:荷载参数>路径查询字段
    const params = {
      ...query,
      ...payload
    }
    return this._ensureCategoryIdUndefined(params) && this._ensureKeywordDefined(params)
  }
}
