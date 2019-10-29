/* eslint-disable */
require('../../app')

const {
  expect
} = require('chai')
const CommentValidator = require('../../../lib/validators/CommentValidator')

const test_undefined = undefined
const test_empty_object={}
const test_params_not_mongoid = "123"
const test_params_mongoid = "5db54ac13aa30e7cb4f9f059"
const test_wrong_payload = {
  nickname: 123,
  email: 123,
  content: 123,
  article_id: 123,
  parent_id: undefined
}
const test_exactly_payload = {
  nickname: '654879',
  email: 'example@163.com',
  content: '12312313212354asdasdas qw dashd asid hlaS - u012u021y ',
  article_id: '5db54ac13aa30e7cb4f9f059',
  parent_id: '5db54ac13aa30e7cb4f9f059'
}
const test_wrong_put_payload = {
  content: '12312313212354asdasdas qw dashd asid hlaS - u012u021y ',
  article_id: 321,
  parent_id: '5db54ac13aa30e7cb4f9f059'
}
const test_exactly_put_payload = {
  content: '12312313212354asdasdas qw dashd asid hlaS - u012u021y ',
  article_id: '5db54ac13aa30e7cb4f9f059',
  parent_id: '5db54ac13aa30e7cb4f9f059'
}

const validator = new CommentValidator()

describe('CommentValidator', () => {
  describe('#checkParams', () => {
    it('#checkParams wrong', () => {
      try {
        validator.checkParams(test_params_not_mongoid)
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
    });
    it('#checkParams right', () => {
      expect(validator.checkParams(test_params_mongoid)).to.be.true
    });
  });
  describe('#checkPayload', () => {
    it('payload undefined', () => {
      try {
        validator.checkPayload(test_undefined)
      } catch (error) {
        expect(error.message).to.be.equal('请确保传入的payload非空，并且是一个对象')
      }
    });
    it('payload empty object', () => {
      try {
        validator.checkPayload(test_empty_object)
      } catch (error) {
        expect(error.message).to.be.equal('请确保传入的payload非空，并且是一个对象')
      }
    });
    it('payload property wrong type', () => {
      try {
        validator.checkPayload(test_wrong_payload)
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
    });
    it('payload property exactly type', () => {
        expect(validator.checkPayload(test_exactly_payload)).to.be.true
    });
  });

  describe('#checkPutPayload', () => {
    it('payload property wrong type', () => {
      try {
        validator.checkPutPayload(test_wrong_put_payload)
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
    });
    it('payload property exactly type', () => {
      expect(validator.checkPutPayload(test_exactly_put_payload)).to.be.true
    });
  });
});
