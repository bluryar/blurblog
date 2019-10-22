module.exports =
  /**
   * 将源对象转换成一个键值对相反的对象并返回
   * @param {Object} source 源对象
   * @return {Object} 与source键值对相反的对象
   */
  function (source) {
    return Object.fromEntries(
      Object.entries(source)
        .filter(item => item.reverse())
    )
  }
