
/* eslint-disable */
require('../../app')

const {
  expect
} = require('chai')
const CategoryValidator = require('../../../lib/validators/CategoryValidator')
// fail
const test1 = {}
const test2 = { name: '123' }
const test3 = { key: '123' }
const test4 = { name: 123, key: 123 }
// success
const test5 = { name: '123', key: '123' }
const test6 = { ...test5, parent_id: '5d84dc06ffadcd0b94e4c7dd' }
// fail
const test7 = { ...test5, parent_id: '123' }

describe('CategoryValidator', () => {
  describe('#checkPayload params in construct', () => {
    it('without name\key', () => {
      try {
        const validator = new CategoryValidator(test1)
        validator.checkPayload()
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
      try {
        const validator = new CategoryValidator(test2)
        validator.checkPayload()
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
      try {
        const validator = new CategoryValidator(test3)
        validator.checkPayload()
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
    })
    it('(TypeWrong)with name and key', () => {
      try {
        const validator = new CategoryValidator(test4)
        validator.checkPayload()
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
    })
    it('with name and key', () => {
        const validator = new CategoryValidator(test5)
        expect(validator.checkPayload()).to.be.true
    })
    it('with name, key and parent_id', () => {
        const validator = new CategoryValidator(test6)
        expect(validator.checkPayload()).to.be.true
    })
    it('(TypeWrong)with name, key and parent_id', () => {
      try {
        const validator = new CategoryValidator(test7)
        expect(validator.checkPayload()).to.be.true
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
    })
  })

  describe('#checkPayload params in function', () => {
    it('#with name, key and parent_id', () => {
        const validator = new CategoryValidator(test6)
        expect(validator.checkPayload(test6)).to.be.true
    });
  });

  describe('#checkPutPayload', () => {
    it('checkPutPayload', () => {
      const validator = new CategoryValidator(test6)
      expect(validator.checkPutPayload(test2)).to.be.true
      expect(validator.checkPutPayload(test3)).to.be.true
      expect(validator.checkPutPayload(test5)).to.be.true
      expect(validator.checkPutPayload(test6)).to.be.true
      try {
        validator.checkPutPayload(test4)
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
      try {
        validator.checkPutPayload(test7)
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
    });
  });
})
