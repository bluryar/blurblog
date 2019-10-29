/* eslint-disable */
require('../../app')

const {
  expect
} = require('chai')
const ArticleValidator = require('../../../lib/validators/ArticleValidator')
describe('ArticleValidator', () => {
  it('#checkPayload 空对象', () => {
    try {
      const validator = new ArticleValidator({})
      validator.checkPayload()
    } catch (error) {
      expect(error.code).to.be.equal(400)
    }
  })
  it('#checkPayload 对象属性为空', () => {
    try {
      const validator = new ArticleValidator({
        title: undefined,
        author: undefined,
        content: undefined,
        cover: undefined,
        category_id: undefined
      })
      validator.checkPayload()
    } catch (error) {
      console.log(error)
      expect(error.code).to.be.equal(400)
    }
  })
  it('#checkPayload 对象属性为空字符', () => {
    try {
      const validator = new ArticleValidator({
        title: "",
        author: "",
        content: "",
        cover: ""
      })
      validator.checkPayload()
    } catch (error) {
      expect(error.code).to.be.equal(422)
    }
  })
  it('#checkPayload 通过检测', () => {
    const validator = new ArticleValidator({
      title: "123",
      author: "123",
      content: "123",
      cover: "123",
      category_id: "5dadadad14c823579457b746"
    })
    expect(validator.checkPayload()).to.be.true

  })
  it('#checkPayload 缺少分类id值', () => {
    try {
      const validator = new ArticleValidator({
        title: "123",
        author: "123",
        content: "123",
        cover: "123",
      })
      expect(validator.checkPayload()).to.be.true
    } catch (error) {
      console.log(error)
      expect(error.code).to.be.equal(400)
    }

  })

  it('checkCtxParamsId', () => {
    const validator = new ArticleValidator()
    expect(validator.checkCtxParamsId('5db2cb7c8af4564a8c150c2b')).to.be.true
  });
  it('#checkPutPayLoad', () => {
    const validator = new ArticleValidator({
      author: "123",
      content: "123",
      cover: "123",
    })
    expect(validator.checkPutPayload()).to.be.true
  });

  describe('#checkQueryAndPayload', () => {
    const validator = new ArticleValidator()
    it('without input params', () => {
      const result = validator.checkQueryAndPayload()
      expect(result.page).to.be.equal('1')
      expect(result.keyword).to.be.undefined
    });
    it('with query params,but without payload', () => {
      const result = validator.checkQueryAndPayload({
        page: '2',
        desc: {
          created_at: false,
          browse: true
        }
      })
      expect(result.page).to.be.equal('2')
      expect(result.desc.created_at).to.be.false
    });
    it('with query params(wrong input),but without payload', () => {
      try {
        const result = validator.checkQueryAndPayload({
          page: 2
        })
        expect(result.page).to.be.equal('2')
      } catch (error) {
        expect(error.code).to.be.equal(400)
      }
      try {
        const result2 = validator.checkQueryAndPayload({
          desc: {
            create_at: false
          }
        })
        expect(result.desc.created_at).to.be.false
      } catch (error) {
        expect(error.message).to.be.equal('desc由两个属性组成 created_at\browse')
      }
    });
  });

  it('#ensureSearch', () => {
    const validator = new ArticleValidator()
    expect(validator.ensureSearch({keyword:1})).to.be.true
    expect(validator.ensureSearch({keyword:1}, {a:1})).to.be.true
    try {
      expect(validator.ensureSearch({keyword:123}, {category_id:12})).to.be.true
    } catch (error) {
      expect(error.code).to.be.equal(400)
    }
    try {
      expect(validator.ensureSearch({}, {a:1})).to.be.true
    } catch (error) {
      expect(error.code).to.be.equal(400)
    }
  })
})
