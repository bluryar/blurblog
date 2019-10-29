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

const CommentSchema = mongoose.Schema({
  // 评论人的名字
  nickname: {
    type: String,
    require: true,
    unique: true
  },
  // 评论人的邮箱
  email: {
    type: String,
    require: true,
    unique: true
  },
  // 评论内容
  content: {
    type: String,
    require: true
  },
  // 文章ID
  article_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Articles'
  },
  // 评论父级ID
  parent_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  deleted_at: {
    type: Date
  }
}, options)

module.exports =
  /**
   * 获取Comments模型
   * @param { mongoose.Connection } dbc 连接实例
   * @returns {mongoose.model} mongoose.model
   */
  function getCommentsModel (dbc) {
    if (dbc === undefined) throw new global.HttpError(500, '获取数据库模型失败', 2101)
    if (!(dbc instanceof mongoose.Connection)) throw new global.HttpError(500)
    return dbc.model('Comments', CommentSchema)
  }
