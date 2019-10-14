/* eslint-disable */
const {
  expect
} = require('chai')
const reverseObject = require('../lib/util/reverse-object')

describe('reverseObject', () => {
  it('reverseObject', () => {
    const obj = {
      a: 1,
      b: 2
    }
    expect(reverseObject(obj)[1]).not.to.be.undefined
  })
})
