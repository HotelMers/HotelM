const BookInfo = require('../lib/mongo').BookInfo
var id_array =new Array()

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
    id_array.push(customer.id)
    return BookInfo.create(customer).exec()
  }

  // 删除一个预订信息
  deleteInfoByid: function deleteInfoByid (id) {
    return BookInfo.deleteOne({ id: id }).exec()
  }
}
