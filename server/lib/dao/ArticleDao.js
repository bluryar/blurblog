const getArticlesModel = require('../../app/models/article')

module.exports =
  /**
   *  通过一个数据库连接实例来获取Model，从而获取Dao
   * @param {NativeConnection} dbc 由Mongoose.createConnections生成
   * @returns {AdminDao} AdminDao Class
   */
  function getArticleDao (dbc) {
    if (!dbc) throw new Error('dbc（mongoose连接实例）不能为空')

    // Article 模型对象
    const Article = getArticlesModel(dbc)
    const HttpError = global.HttpError

    return class ArticleDao {
      /**
       * 创建文章
       * @param {Object} data 数据对象
       */
      static async createArticle (data) {
        const {
          title,
          author,
          content,
          cover,
          category_id: categoryId
        } = data
        let doc
        try {
          // 查找是否存在一篇同标题且同作者的文档
          doc = await Article.findOne({
            title,
            author,
            deleted_at: {
              $exists: false
            }
          })
        } catch (error) {
          throw (new HttpError(500, '数据库查找失败')).nestAnErrorTo500(error)
        }
        if (doc) throw new HttpError(403, '文章已存在')

        // 创建并填充文档
        const article = new Article()
        article.title = title
        article.author = author
        article.content = content
        article.cover = cover
        article.category_id = categoryId

        try {
          const result = await article.save()
          global.logger.DATABASE.info(`插入数据 title:${title} 成功`)
          return result
        } catch (error) {
          throw (new HttpError(500, '数据库查找失败')).nestAnErrorTo500(error)
        }
      }

      /**
       * 查找并删除文章（若文章尚未被删除）
       * @param {String | ObjectId} id mongodb的id
       */
      static async findAndDeleteById (id) {
        if (id === undefined) throw new Error('参数id不存在')
        // 通过了路由参数校验就说明id是MongoId，所以此处不重复校验

        let doc // 查找文档是否存在，并且没有被删除
        try {
          doc = await Article.findOne({
            _id: id,
            deleted_at: {
              $exists: false
            }
          })
        } catch (error) {
          throw (new HttpError(500, '数据库查找失败')).nestAnErrorTo500(error)
        }
        if (doc === null) throw new HttpError(400, '不存在这样的文档（id错误）', 1203)

        let result // 删除
        try {
          result = await Article.updateOne({
            _id: id
          }, {
            deleted_at: new Date(),
            $inc: {
              __v: 1
            }
          })
          if (result.nModified < 1) throw new HttpError(500, '数据库删除文档失败')
        } catch (error) {
          throw (new HttpError(500, '数据库删除文档失败')).nestAnErrorTo500(error)
        }
        global.logger.DATABASE.warn(`删除文档 ${doc.title}!!`)
        return result
      }

      /**
       * 更新文章
       * @param {Object} data 荷载对象
       * @param {String | ObjectId} id mongodb的id
       */
      static async updateArticleById (data, id) {
        if (!data || !id) throw new Error('参数不能为空')
        // 查找未删除文档
        let doc
        try {
          doc = await Article.findOne({
            _id: id,
            deleted_at: {
              $exists: false
            }
          })
        } catch (error) {
          throw (new HttpError(500, '数据库查找失败')).nestAnErrorTo500(error)
        }

        if (doc === null) throw new HttpError(400, '不存在这样的文档（id错误）', 1203)
        // 更新文档
        let result
        try {
          result = await Article.updateOne({
            _id: id
          }, {
            ...data,
            $inc: {
              __v: 1
            }
          })
        } catch (error) {
          throw (new HttpError(500, '数据库查找失败')).nestAnErrorTo500(error)
        }
        if (result.nModified === 1) global.logger.DATABASE.warn(`更新文档 ${doc.title} 成功!!`)
        else throw new HttpError(500, '更新失败')
        return result
      }

      /**
       * 获取文章信息
       * @param {String} id mongodb的文档id
       */
      static async findOneArticleById (id) {
        if (!id) throw new Error('id不能为空')

        let doc
        try {
          doc = await Article.findOne({
            _id: id,
            deleted_at: {
              $exists: false
            }
          })
        } catch (error) {
          throw (new HttpError(500, '数据库查找失败')).nestAnErrorTo500(error)
        }
        if (doc === null) throw new HttpError(400, `不存在这样的文档 id:${id}`)
        global.logger.DATABASE.warn(`查询文档 ${doc.title}!!`)
        return doc._doc
      }

      /**
       * 根据page查询对应page&desc下的10篇文章
       * @param {Object} params 查询参数
       * @returns {Array} 文章列表数组
       */
      static async findPageDescArticle (params) {
        if (!params) throw new Error('参数不能为空')

        // 策略模式单例对象
        const FindStrategy = require('./NAL-ParamsStrategy')(params)

        let result
        try {
          result = await FindStrategy.findByModel(Article)
        } catch (error) {
          throw (new HttpError(500, '数据库查找失败')).nestAnErrorTo500(error)
        }
        return result
      }

      /**
       * 计算分类下的文档数量
       * @param {String} categoryId 分类mongoid
       */
      static async countArticleByCategoryId (categoryId) {
        if (!categoryId) throw new Error('categoryId不能为空')
        const validator = require('validator')
        if (!validator.isMongoId(categoryId)) throw new HttpError(422, '请传入正确的id')
        const count = await Article.count({ category_id: categoryId, deleted_at: { $exists: false } })

        return count
      }
    }
  }
