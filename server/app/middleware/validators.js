const validators = require('../../lib/validators')

module.exports = async (ctx, next) => {
  ctx.validators = validators
  await next()
}
