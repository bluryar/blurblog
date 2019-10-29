const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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

const salt = bcrypt.genSaltSync(10)

/**
 * @todo  校验，永远不要相信用户输入和参数校验后传入的参数值
 */
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
    /** @todo 这一项应该传入一个加密后的值 */
    type: String,
    required: true,
    set (value) { // 数据库不存放明文密码
      const hash = bcrypt.hashSync(value, salt)
      return hash
    }
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
    if (!(dbc instanceof mongoose.Connection)) throw new global.HttpError(500)
    if (dbc === undefined) throw new global.HttpError(500, '获取数据库模型失败', 2101)
    return dbc.model('Users', UserSchema)
  }
