const getCategoriesModel = require('../../app/models/category')

module.exports =
  /**
   *  通过一个数据库连接实例来获取Model，从而获取Dao
   * @param {NativeConnection} dbc 由Mongoose.createConnections生成
   * @returns {AdminDao} AdminDao Class
   */
  function getCategoryDao (dbc) {
    if (!dbc) throw new Error('dbc（mongoose连接实例）不能为空')

    // Category 模型对象
    const Category = getCategoriesModel(dbc)
    const HttpError = global.HttpError
    const notExistsFilter = { deleted_at: { $exists: false } }
    const get500Error = (msg, error) => { return (new HttpError(500, msg)).nestAnErrorTo500(error) }

    /** 数据访问静态类 */
    return class CategoryDao {
      /**
       *  创建分类
       * @param {Object} payload 经过校验的参数
       */
      static async createCategory (payload) {
        if (!payload) throw new Error('payload未定义')

        let doc
        try {
          doc = await Category.findOne({
            name: payload.name,
            ...notExistsFilter
          })
        } catch (error) {
          throw get500Error('查找文档失败', error)
        }

        if (doc) throw new HttpError(403, '分类已存在')

        const category = new Category()
        category.name = payload.name
        category.key = payload.key
        if (payload.parent_id) category.parent_id = payload.parent_id

        try {
          const result = await category.save()
          return result
        } catch (error) {
          throw get500Error('创建文档失败', error)
        }
      }

      /**
       * 删除分类
       * @param {String} params 路径参数
       */
      static async deleteCategory (params) {
        if (!params) throw new Error('缺少路径参数')

        let doc
        try {
          const o = {
            _id: params,
            ...notExistsFilter
          }
          doc = await Category.findOne(o)
        } catch (error) {
          throw get500Error('查找文档失败', error)
        }
        if (doc === null) throw new HttpError(403, '文档不存在')

        let result
        try {
          result = await Category.updateOne({
            _id: params,
            ...notExistsFilter
          }, {
            deleted_at: new Date(),
            $inc: {
              __v: 1
            }
          })
          if (result.nModified < 1) throw new HttpError(500, '数据库删除文档失败')
          return result
        } catch (error) {
          throw get500Error('数据库删除文档失败', error)
        }
      }

      /**
       * 更新分类
       * @param {String} params 路径参数
       * @param {Object} payload 经过校验的参数
       */
      static async updateCategory (params, payload) {
        if (!params || !payload) throw new Error('参数为空')
        if (payload.parent_id && params === payload.parent_id) throw new HttpError(422, '不能以自身作为父类')
        let doc
        try {
          doc = await Category.findOne({ _id: params, ...notExistsFilter })
        } catch (error) {
          throw get500Error('文档查询失败', error)
        }
        if (doc === null) throw new HttpError(403, '文档不存在')

        let result
        try {
          result = await Category.updateOne({ _id: params }, { ...payload, $inc: { __v: 1 } })
          return result
        } catch (error) {
          throw get500Error('文档更新失败', error)
        }
      }

      static async findAllCategory () {
        let result
        try {
          result = await Category.find(notExistsFilter)
        } catch (error) {
          throw get500Error('查找文档失败', error)
        }

        return result
      }

      static async findCategoryById (id) {
        let result
        try {
          result = await Category.findOne({ ...notExistsFilter, _id: id })
        } catch (error) {
          throw get500Error('查找文档失败', error)
        }

        return result
      }
    }
  }
