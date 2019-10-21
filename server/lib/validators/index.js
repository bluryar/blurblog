const requireDir = require('require-directory')
// 自动导入导出
requireDir(module, '../validators', {
  visit (validator) {
    exports[validator.name] = validator
  },
  exclude (path) {
    console.log(`/lib/validators/index.js: auto loading file: ${path.match(/\^\w+\.js$/)}`)
    return /\^\w+\.js$/.test(path) ? 1 : 0
  }
})
