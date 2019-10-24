const requireDir = require('require-directory')

const regExp = /NAL-\w+.js/
// 自动导入导出
requireDir(module, __dirname, {
  visit (validator) {
    exports[validator.name] = validator
  },
  exclude (path) {
    if (path.match(regExp)) {
      global.logger.default.info(`lib/validators/index.js: auto-loading module ignore this file: ${path.match(regExp)}`)
    } else global.logger.default.info(`lib/validators/index.js: auto-loading module LOADING this file: ${path.match(/\w+\.js$/)}`)
    return regExp.test(path) ? 1 : 0
  }
})
