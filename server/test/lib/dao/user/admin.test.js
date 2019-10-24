/* eslint-disable */
const {
  expect
} = require('chai')
const mongoose = require('mongoose')
const getAdminDao = require('../../../../lib/dao/user/AdminDao')
const AppManager = require('../../../../lib/AppManager')
const dbConnect = require('../../../../app/routes/NAL-dbConnection')
const ctx = {}
const am = AppManager()
am.load()

const app = require('../../../app')

describe('AdminDao', async () => {
  it('#CreateAdmin', async () => {
    let result
    const mongodbConfig = global.config.mongodb
    const url = `${mongodbConfig.urlPrefix}${mongodbConfig.host}:${mongodbConfig.port}`
    // 打开数据库添加到请求上下文
    // const DB = await mongoose.connect(url, mongodbConfig.mongoose)

    try {
      await dbConnect(ctx, async () => {
        const AdminDao = getAdminDao(ctx.db)
        result = await AdminDao.createAdmin({
          nickname: '李花花12345',
          email: 'example@outlook.com12345',
          password1: '12345678',
          password2: '12345678'
        })

        console.log(result)
        // DB.connection.close()
      })
      expect(result).not.undefined
      expect(result).not.null
    } catch (error) {
      expect(error.msg).to.be.equal('管理员已存在')
    }

  })

  it('checkPassword', async () => {
    let result
    const mongodbConfig = global.config.mongodb
    const url = `${mongodbConfig.urlPrefix}${mongodbConfig.host}:${mongodbConfig.port}`
    // 打开数据库添加到请求上下文
    // const DB = await mongoose.connect(url, mongodbConfig.mongoose)

    try {
      await dbConnect(ctx, async () => {
        const AdminDao = getAdminDao(ctx.db)
        result = await AdminDao.checkPassword({
          "email": "exampl1e2@163.com",
          "password": "12345678"
        })

        console.log(result)
        // DB.connection.close()
      })
      expect(result).not.undefined
      expect(result).not.null
      expect(result).to.be.true
    } catch (error) {
      expect(error.msg).to.be.equal('用户不存在')
    }
  });

  it('findAdminByEmail AdminNotExists', async () => {
    try {
      await dbConnect(ctx, async () => {
        const AdminDao = getAdminDao(ctx.db)
        result = await AdminDao.findAdminByEmail("exampl1e22@163.com")

        console.log(result)
        // DB.connection.close()
      })
      expect(result).undefined
      expect(result).null
    } catch (error) {
      expect(error.code).to.be.equal(500)
    }
  });
  it('findAdminByEmail Admin Exists', async () => {
    await dbConnect(ctx, async () => {
      const AdminDao = getAdminDao(ctx.db)
      result = await AdminDao.findAdminByEmail("exampl1e2@163.com")

      console.log(result)
      // DB.connection.close()
    })
    expect(result).not.undefined
    expect(result).not.null
  });
})
