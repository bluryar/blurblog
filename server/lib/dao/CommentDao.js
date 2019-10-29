const getCommentsModel = require('../../app/models/comment')

module.exports =
  /**
   *  通过一个数据库连接实例来获取Model，从而获取Dao
   * @param {NativeConnection} dbc 由Mongoose.createConnections生成
   * @returns {CommentDao} CommentDao Class
   */
  function getCommentDao (dbc) {
    if (!dbc) throw new Error('dbc（mongoose连接实例）不能为空')

    // Comment 模型对象
    const Comment = getCommentsModel(dbc)
    const HttpError = global.HttpError
    const notExistsFilter = { deleted_at: { $exists: false } }
    const addVersion = { $inc: { __v: 1 } }
    // 工具函数
    const findFail = (error) => { return (new HttpError(500, '查找文档失败')).nestAnErrorTo500(error) }
    const createFail = (error) => { return (new HttpError(500, '创建文档失败')).nestAnErrorTo500(error) }
    const updateFail = (error) => { return (new HttpError(500, '更新文档失败')).nestAnErrorTo500(error) }
    const deleteFail = (error) => { return (new HttpError(500, '删除文档失败')).nestAnErrorTo500(error) }
    const isUndefined = data => { if (data === undefined) throw new Error('参数为空') }
    // const docExisted = () => { return new HttpError(403, '文档已经存在') }
    const docNotExisted = () => { return new HttpError(403, '文档不存在') }

    /** 数据访问静态类 */
    return class CommentDao {
      static async createComment (payload) {
        isUndefined(payload)

        let doc1, doc2
        try {
          doc1 = await Comment.findOne({
            email: payload.email,
            ...notExistsFilter
          })
          doc2 = await Comment.findOne({
            nickname: payload.nickname,
            ...notExistsFilter
          })
        } catch (error) {
          throw findFail(error)
        }
        if (doc1) throw new HttpError(403, `${doc1.email}已存在，请重新填写email`)
        if (doc2) throw new HttpError(403, `${doc2.nickname}已存在，请重新填写nickname`)

        const comment = new Comment()
        comment.nickname = payload.nickname
        comment.email = payload.email
        comment.content = payload.content
        comment.article_id = payload.article_id
        if (payload.parent_id)comment.parent_id = payload.parent_id

        try {
          const result = await comment.save()
          return result
        } catch (error) {
          throw createFail(error)
        }
      }

      static async updateComment (id, payload) {
        isUndefined(id)
        isUndefined(payload)

        let doc
        try {
          doc = await Comment.findOne({ _id: id, ...notExistsFilter })
        } catch (error) {
          throw findFail(error)
        }
        if (doc === null) throw docNotExisted()

        try {
          const result = await Comment.updateOne({ _id: id }, { ...payload, ...addVersion })
          if (result.nModified === 1) global.logger.DATABASE.warn(`更新文档 ${result.id} 成功!!`)
          else throw new HttpError(500, '更新失败')
          return result
        } catch (error) {
          throw updateFail(error)
        }
      }

      static async deleteComment (id) {
        isUndefined(id)

        try {
          const doc = await Comment.findOne({ _id: id, ...notExistsFilter })
          if (doc === null) throw docNotExisted()
        } catch (error) {
          throw findFail(error)
        }

        try {
          const result = await Comment.updateOne({ _id: id }, { deleted_at: new Date(), ...addVersion })
          if (result.nModified === 1) global.logger.DATABASE.warn(`删除文档 ${result.id} 成功!!`)
          else throw new HttpError(500, '删除失败')
          return result
        } catch (error) {
          throw deleteFail(error)
        }
      }

      static async findOneComment (id) {
        isUndefined(id)

        try {
          const result = await Comment.findOne({ _id: id, ...notExistsFilter })
          if (result === null) throw docNotExisted()
          return result
        } catch (error) {
          throw findFail(error)
        }
      }

      static async findAllComment (page = 1) {
        const cmPerPage = 10 // 每页10篇
        const desc = {
          created_at: 1
        }
        let comments, all
        try {
          comments = await Comment.find({ ...notExistsFilter }, null, { sort: desc, limit: cmPerPage, skip: (page - 1) * cmPerPage })
          all = await Comment.find({ ...notExistsFilter })
        } catch (error) {
          throw findFail(error)
        }
        return {
          data: comments,
          mete: {
            current_page: page,
            per_page: cmPerPage,
            count: comments.length,
            total: all.length,
            total_pages: Math.ceil(all.length / cmPerPage)
          }
        }
      }

      static async findCommentsByArticleId (id, page = 1, desc = { created_at: true, browse: false }) {
        isUndefined(id)
        const _desc = desc.created_at === true ? {
          created_at: -1
        } : {
          browse: -1
        }
        try {
          const result = await Comment.find({ ...notExistsFilter, article_id: id }, null,
            { sort: _desc, limit: 10, skip: (page - 1) * 10 })
          const all = await Comment.find({ ...notExistsFilter })
          return {
            data: result,
            meta: {
              current_page: page,
              per_page: 10,
              count: result.length,
              total: all.length,
              total_pages: Math.ceil(all.length / 10)
            }
          }
        } catch (error) {
          throw findFail(error)
        }
      }
    }
  }
