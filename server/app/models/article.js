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

const ArticleSchema = mongoose.Schema({
  // 文章标题
  title: {
    type: String,
    require: true,
    default: '无标题',
    unique: true
  },
  // 文章作者
  author: {
    type: String,
    require: true,
    default: 'blurblog'
    /** @fix 作者不应该为唯一索引 */
  },
  // 文章内容
  content: {
    type: String,
    require: true
  },
  // 文章封面
  cover: {
    type: String,
    require: true
  },
  // 文章分类ID
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  // 文章浏览次数
  browse: {
    type: Number,
    require: true,
    default: 0
  },
  delete_at: {
    type: Date
  }
}, options)

module.exports =
  /**
   * 获取Articles模型
   * @param { mongoose.Connection } dbc 连接实例
   * @returns {mongoose.model} mongoose.model
   */
  function getArticlesModel (dbc) {
    if (dbc === undefined) throw new global.HttpError(500, '获取数据库模型失败', 2101)
    if (!(dbc instanceof mongoose.Connection)) throw new global.HttpError(500)
    return dbc.model('Articles', ArticleSchema)
  }
