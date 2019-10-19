const requireDir = require('require-directory')
// 自动导入导出
requireDir(module, '../validators', {
  visit (validator) {
    exports[validator.name] = validator
  },
  exclude: /^(index.js)|(MixinValidator.js)$/
})
