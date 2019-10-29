module.exports = function (params) {
  // 私有变量，处理 params
  const status = {
    // 获取page设置
    get page () {
      return parseInt(params.page) // 想要查询的页码
    },
    // category_id是‘*’ 还是 mongoID
    get category_id () {
      return params.category_id === '*' ? undefined : params.category_id
    },
    // desc的两个状态的选择
    get desc () {
      return params.desc.created_at === true ? {
        created_at: -1
      } : {
        browse: -1
      }
    },
    // keyword是否为空
    get keyword () {
      return params.keyword ? new RegExp(params.keyword) : undefined
    }
  }
  const strategy = {
    get docNum () {
      return 10
    }, // 返回/跳过 10条文档
    get skip () {
      return (status.page - 1) * this.docNum
    },
    get desc () {
      return status.desc
    },
    filter: {
      deleted_at: {
        $exists: false
      }
    }, // 初始过滤器
    get option () {
      return {
        sort: this.desc,
        skip: this.skip,
        limit: this.docNum
      }
    },
    cateAndKey (Model) {
      return Model.find({
        ...this.filter,
        category_id: status.category_id,
        title: status.keyword
      }, null, this.option)
    },
    async notCateButKey (Model) {
      return Model.find({
        ...this.filter,
        title: status.keyword
      }, null, this.option)
    },
    notKeyButCate (Model) {
      return Model.find({
        ...this.filter,
        category_id: status.category_id
      }, null, this.option)
    },
    neitherCateNorKey (Model) {
      return Model.find({
        ...this.filter
      }, null, this.option)
    }
  }
  return {
    /**
     * 通过传入的模型对象查找数据
     * @param {Model} Model mongoose model实例
     * @returns mongoose Query实例
     */
    async findByModel (Model) {
      const fn = {
        cateAndKey: '11',
        notCateButKey: '01',
        notKeyButCate: '10',
        neitherCateNorKey: '00'
      }
      const express = `${status.category_id ? '1' : '0'}${status.keyword ? '1' : '0'}`
      let queryPromise
      require('lodash').forEach(fn, (value, key) => {
        if (express === value) { // 遍历寻找匹配的策略
          queryPromise = new Promise((resolve) => resolve(strategy[key](Model)))
        }
      })
      const result = await queryPromise
      const count = (await Model.find({ deleted_at: { $exists: false } })).length
      return {
        data: result,
        // 分页
        meta: {
          current_page: status.page, // 当前页
          per_page: strategy.docNum, // 每页有多少文档
          count: result.length, // 本次搜索的文档数量
          total: count, // 文档总数量
          total_pages: Math.ceil(count / strategy.docNum) // 文档可以分多少页
        }
      }
    }
  }
}
