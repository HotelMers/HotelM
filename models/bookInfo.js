const BookInfo = require('../lib/mongo').BookInfo
var id_array =new Array()

module.exports = {
  // 通过客户id获取预定信息
  getBookInfoById: function getBookInfoById (id) {
    return BookInfo
      .findOne({ id: id })
      .addCreatedAt()
      .exec()
  },

  // 添加一个预定信息
  create: function create (bookinfo) {
    id_array.push(bookinfo.id)
    return BookInfo.create(bookinfo).exec()
  }

  // 删除一个预订信息
  deleteInfoByid: function deleteInfoByid (id) {
    return BookInfo.deleteOne({ id: id }).exec()
  }
}
