const getLog4js = require('../../lib/logger')
module.exports = () => {
  return async (ctx, next) => {
    ctx.logger = getLog4js().getLogger('HTTP_ERROR')
    await next()
  }
}
