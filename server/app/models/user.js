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
const UserSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  isViolated: { // 是否违规用户
    type: Boolean,
    default: false
  },
  // id, mongodb自动创建并设置索引
  nickname: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  deleted_at: {
    type: Date
  },
  ip: {
    type: [String]
  }
}, options)

// 要实现一个http请求对应一次数据库连接，那么创建模型的时候，不能使用mongoose.model
module.exports =
  /**
   * 获取AdminUser模型
   * @param {NativeConnection} dbc 由Mongoose.createConnections生成
   * @returns {Model} Users
   */
  function getUsersModel (dbc) {
    if (dbc === undefined) throw new global.HttpError(500, '获取数据库模型失败', 2101)
    return dbc.model('Users', UserSchema)
  }
