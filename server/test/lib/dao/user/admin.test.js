/* eslint-disable */
const {
  expect
} = require('chai')
const mongoose = require('mongoose')
const getAdminDao = require('../../../../lib/dao/user/admin')
const AppManager = require('../../../../lib/AppManager')
const dbConnect = require('../../../../app/routes/dbConnection')
const ctx = {}
const am = AppManager()
am.load()

describe('AdminDao', async () => {
  it('#CreateAdmin', async () => {
    let result
    const mongodbConfig = global.config.mongodb
    const url = `${mongodbConfig.urlPrefix}${mongodbConfig.host}:${mongodbConfig.port}`
    // 打开数据库添加到请求上下文
    // const DB = await mongoose.connect(url, mongodbConfig.mongoose)
    await dbConnect(ctx, async ()=>{
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
  })

})
