/* eslint-disable */
const {
  expect
} = require('chai')
const validators = require('../../lib/validators')
global.HttpError = require('../../lib/http-error')
describe('AdminValidator', () => {
  describe('AdminValidator no params to constructot', () => {
    const admin = new validators.AdminValidator()
    it('checkNickname', () => {
      try {
        admin.checkNickname('')
      } catch (error) {
        expect(error.message).to.equal('昵称名不能为空')
      }
      try {
        admin.checkNickname('12')
      } catch (error) {
        expect(error.message).to.equal('昵称名长度应在3-10之间')
      }
      try {
        admin.checkNickname('12345678901')
      } catch (error) {
        expect(error.message).to.equal('昵称名长度应在3-10之间')
      }
      try {
        admin.checkNickname(123456)
      } catch (error) {
        expect(error).to.be.an.instanceof(global.HttpError)
      }
      expect(admin.checkNickname('123654')).to.be.true
    })

    it('checkEmail', () => {
      try {
        admin.checkEmail('')
      } catch (error) {
        expect(error.message).to.equal('邮箱不能为空')
      }
      try {
        admin.checkEmail('asd')
      } catch (error) {
        expect(error.message).to.equal('邮箱格式错误')
      }
      try {
        admin.checkEmail('@.com')
      } catch (error) {
        expect(error.message).to.equal('邮箱格式错误')
      }
      expect(admin.checkEmail('example@163.com')).to.true
    });

    it('checkRegisterPassword', () => {
      try {
        admin.checkRegisterPassword('asd12345', '12345asd')
      } catch (error) {
        expect(error.message).to.equal('两次输入密码不一致')
      }
      try {
        admin.checkRegisterPassword('asd', 'asd')
      } catch (error) {
        expect(error.message).to.equal('密码长度在8-16个字符之间')
      }
      try {
        admin.checkRegisterPassword('asd12345_', 'asd12345_')
      } catch (error) {
        expect(error.message).to.equal('密码只能由字母和数字组成')
      }
      expect(admin.checkRegisterPassword('asd123456', 'asd123456')).to.be.true
    })

    it('checkLoginPassword', () => {
      try {
        admin.checkLoginPassword('asd')
      } catch (error) {
        expect(error.message).to.equal('密码长度在8-16个字符之间')
      }
      try {
        admin.checkLoginPassword('asd12345_')
      } catch (error) {
        expect(error.message).to.equal('密码只能由字母和数字组成')
      }
      expect(admin.checkLoginPassword('asd123456')).to.be.true
    })

  })
  describe('AdminValidator with params passing to constructor', () => {
    it('#register', () => {
      const admin = new validators.AdminValidator({
        nickname: '123654',
        password1: 'asdasdas',
        password2: 'asdasdas',
        email: 'example@163.com'
      })
      expect(admin.checkPayload()).be.true
    });
    it('#login', () => {
      const admin = new validators.AdminValidator({
        nickname: '123654',
        password: 'asdasdas',
        email: 'example@163.com'
      })
      expect(admin.checkPayload('login')).be.true
    });
    it('neither login nor register', () => {
      const admin = new validators.AdminValidator({
        nickname: '123654',
        password: 'asdasdas',
        email: 'example@163.com'
      })
      try {
        admin.checkPayload('hoha')
      } catch (error) {
        expect(error).to.be.an.instanceOf(global.HttpError)
      }
    });
  });
  describe('middleware-validators', () => {
    it('AdminValidator', async () => {
      const valiMiddleware = require('../../app/middleware/validators')
      const ctx = {}
      await valiMiddleware(ctx, () => {})
      expect(ctx.validators).not.be.be.undefined
    })
  })
});
