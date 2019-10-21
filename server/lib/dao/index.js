/**
 * @todo 自动导入逻辑
 * 约定本文件夹下的每一个DAO都只暴露一个叫做getXXXDao（dbc）的方法，该方法接受ctx.db-->数据库连接实例
 */
const requireDir = require('require-directory')
// 自动导入导出
const arr = []
requireDir(module, '../dao', {
  visit (getXxxDao) {
    arr.push(getXxxDao)
  },
  exclude (path) {
    console.log(`lib/dao/index.js: auto loading file: ${path.match(/\^\w+\.js$/)}`)
    return /\^\w+\.js$/.test(path) ? 1 : 0
  }
})

module.exports = arr
