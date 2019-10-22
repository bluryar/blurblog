const getUsersModel = require('../../../app/models/user')
const hasntUndefined = require('../../util/each-prop-not-undefined') // 工具函数，判断某个对象的所有属性不为undefined

const bcrypt = require('bcrypt')

module.exports =
  /**
   *  通过一个数据库连接实例来获取Model，从而获取Dao
   * @param {NativeConnection} dbc 由Mongoose.createConnections生成
   * @returns {AdminDao} AdminDao Class
   */
  function getAdminDao (dbc) {
    if (dbc === undefined) throw new global.HttpError(500, '获取Dao失败', 2201)

    // 获取Admin模型对象
    const Admin = getUsersModel(dbc)

    return class AdminDao {
    /**
     * @param {Object} data 通过校验的ctx.request.body
     */
      static async createAdmin (data) {
        if (data === undefined) throw new global.HttpError(400, '请求参数对象为空', 1201)
        if (!hasntUndefined(data)) throw new global.HttpError(400, '请求参数对象的部分参数为空', 1201)

        // 判断文档是否存在
        let isExists
        try {
          isExists = await Admin.findOne({
            isAdmin: true,
            email: data.email,
            deleted_at: {
              $exists: false
            }
          })
        } catch (error) {
          const newErr = new global.HttpError(500, '查找文档失败', 2002)
          throw newErr.nestAnErrorTo500(error)
        }
        if (isExists) throw new global.HttpError(403, '管理员已存在', 1202)

        // 填充文档字段
        const admin = new Admin()
        admin.isAdmin = true
        admin.nickname = data.nickname
        admin.email = data.email
        admin.password = data.password2

        // 保存文档
        let result
        try {
          result = await admin.save()
        } catch (error) {
          throw (new global.HttpError(500, '保存文档失败', 2001)).nestAnErrorTo500(error)
        }
        global.logger.DATABASE.info(`${admin} 插入数据成功`)
        return result
      }

      /**
       * 检测传入的http请求参数中的密码字段是否存在于数据库当中，且密码是否匹配相应email对应的用户
       * @param {HttpRequestData} data http请求参数对象
       * @returns {Boolean} （布尔）密码输入正确
       */
      static async checkPassword (data) {
        if (data === undefined) throw new global.HttpError(400, '请求参数对象为空', 1201)
        if (!hasntUndefined(data)) throw new global.HttpError(400, '请求参数对象的部分参数为空', 1201)

        let doc
        try {
          doc = await Admin.findOne({
            isAdmin: true,
            email: data.email,
            deleted_at: {
              $exists: false
            }
          })
        } catch (error) {
          const newErr = new global.HttpError(500, '查找文档失败', 2002)
          throw newErr.nestAnErrorTo500(error)
        }

        if (!doc) throw new global.HttpError(422, '用户不存在', 1203)

        // 用户存在，校验密码
        if (!bcrypt.compareSync(data.password, doc.password)) throw new global.HttpError(403, '密码输入错误', 1204)

        return true
      }
    }
  }
