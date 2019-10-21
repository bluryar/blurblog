const requireDir = require('require-directory')
// 自动导入导出
requireDir(module, '../validators', {
  visit (validator) {
    exports[validator.name] = validator
  },
  exclude (path) {
    if (path.match(/\^\w+\.js$/)) {
      console.log(`lib/validators/index.js: auto-loading module ignore this file: ${path.match(/\^\w+\.js$/)}`)
    } else console.log(`lib/validators/index.js: auto-loading module LOADING this file: ${path.match(/\w+\.js$/)}`)
    return /\^\w+\.js$/.test(path) ? 1 : 0
  }
})
