const BookInfo = require('../lib/mongo').BookInfo

module.exports = {
  // 通过客户id获取用户信息
  getBookInfoById: function getBookInfoById (id) {
    return BookInfo
      .findOne({ id: id })
      .addCreatedAt()
      .exec()
  },

  // 添加一个客户
  create: function create (customer) {
    return BookInfo.create(customer).exec()
  }
}
