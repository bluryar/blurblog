/**
 * 超类
 */
module.exports = class Dao {
  static getXxxDao () {
    throw new Error('这是一个接口方法，请子类实现')
  }
}
