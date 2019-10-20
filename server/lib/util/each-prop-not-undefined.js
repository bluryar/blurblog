module.exports = function (data) {
  return Object.values(data).every(item => item !== undefined)
}
