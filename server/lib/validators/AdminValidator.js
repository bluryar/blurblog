const WebValidator = require('./^MixinValidator')(false)

module.exports = class AdminValidator extends WebValidator {
  constructor (requestPayload) {
    super(requestPayload)
    this.requestPayload = requestPayload
  }

  checkPayload (api = 'register') {
    if (api !== 'register' && api !== 'login') throw new global.HttpError(500, '参数只能为register、login中的一个', 1101)
    let result = this.checkEmail() /** @bugfix 登录并不校验nickname */
    if (api === 'register') {
      result = result && this.checkRegisterPassword() && this.checkNickname()
    } else {
      result = result && this.checkLoginPassword()
    }
    return result
  }

  checkNickname (_nickname) {
    const nickname = (_nickname === undefined) ? this.getStringValueByKey('nickname') : _nickname
    if (!this._.isString(nickname)) throw new global.HttpError(400, '参数必须字符串', 1101)
    if (this.StringValidator.isEmpty(nickname)) throw new global.HttpError(422, '昵称名不能为空', 1101)
    if (!this.StringValidator.isLength(nickname, {
      min: 3,
      max: 10
    })) throw new global.HttpError(422, '昵称名长度应在3-10之间', 1101)
    return true
  }

  checkEmail (_email) {
    const email = (_email === undefined) ? this.getStringValueByKey('email') : _email
    if (!this._.isString(email)) throw new global.HttpError(400, '参数必须字符串', 1101)
    if (this.StringValidator.isEmpty(email)) throw new global.HttpError(422, '邮箱不能为空', 1101)
    if (!this.StringValidator.isEmail(email)) throw new global.HttpError(422, '邮箱格式错误', 1101)
    return true
  }

  checkRegisterPassword (_password1, _password2) {
    const { password1, password2 } =
      (_password1 === undefined || _password2 === undefined)
        ? {
          password1: this.getStringValueByKey('password1'),
          password2: this.getStringValueByKey('password2')
        } : {
          password1: _password1,
          password2: _password2
        }
    if (!this._.isString(password1)) throw new global.HttpError(400, '参数必须字符串', 1101)
    if (password1 !== password2) throw new global.HttpError(422, '两次输入密码不一致', 1101)
    if (!this.StringValidator.isAlphanumeric(password1)) throw new global.HttpError(422, '密码只能由字母和数字组成', 1101)
    if (!this.StringValidator.isLength(password1, {
      min: 8,
      max: 16
    })) throw new global.HttpError(422, '密码长度在8-16个字符之间', 1101)
    return true
  }

  checkLoginPassword (_password) {
    const password = (_password === undefined) ? this.getStringValueByKey('password') : _password

    if (!this._.isString(password)) throw new global.HttpError(400, '参数必须字符串', 422)
    if (!this.StringValidator.isAlphanumeric(password)) throw new global.HttpError(422, '密码只能由字母和数字组成', 1101)
    if (!this.StringValidator.isLength(password, {
      min: 8,
      max: 16
    })) throw new global.HttpError(422, '密码长度在8-16个字符之间', 1101)
    return true
  }
}
