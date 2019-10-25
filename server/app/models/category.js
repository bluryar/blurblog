const mongoose = require('mongoose')

const options = {
  // 严格模式
  strict: true,
  strictQuery: true,
  useNestedStrict: true,
  // 时间戳
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}

const CategorySchema = mongoose.Schema({
  // 分类名
  name: {
    type: String,
    require: true,
    unique: true
  },
  // 分类键
  key: {
    type: String,
    require: true
  },
  // 分类父级ID，默认为0
  parent_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  deleted_at: {
    type: Date
  }
}, options)

module.exports =
  /**
   * 获取Categories模型
   * @param { mongoose.Connection } dbc 连接实例
   * @returns {mongoose.model} mongoose.model
   */
  function getCategoriesModel (dbc) {
    if (dbc === undefined) throw new global.HttpError(500, '获取数据库模型失败', 2101)
    if (!(dbc instanceof mongoose.Connection)) throw new global.HttpError(500)
    return dbc.model('Categories', CategorySchema)
  }
