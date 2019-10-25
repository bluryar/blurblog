module.exports = async (ctx, next) => {
  if (ctx.is('application/json')) await next()
  else throw new global.HttpError(406)
}
