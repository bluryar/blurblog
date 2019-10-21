const hasntUndefined = require('../../util/each-prop-not-undefined')
const getUserModel = require('../../../app/models/user')

module.exports =
  function getUserDao (dbc) {
    const User = getUserModel(dbc)
    return class UserDao {
      static createUser (data) {
        if (!hasntUndefined(data)) throw new global.HttpError(400, '部分参数为空', 1201)
        throw new Error(`接口未实现  ${User}`)
      }
    }
  }
