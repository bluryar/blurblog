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
      static async createArticle (data) {
        const { title, author, content, cover, category_id: categoryId } = data
        let doc
        try {
          // 查找是否存在一篇同标题且同作者的文档
          doc = await Article.findOne({
            title, author, delete_at: { $exists: false }
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
    }
  }
