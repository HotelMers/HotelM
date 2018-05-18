const BookInfo = require('../lib/mongo').BookInfo

module.exports = {
  // 通过客户id获取预定信息
  getBookInfoById: function getBookInfoById (id) {
    return BookInfo
      .findOne({ id: id })
      .addCreatedAt()
      .exec()
  },
  // 用于删除过期记录
  getBookinfoByEnddates: function getBookinfoByEnddates (days) {
    return BookInfo.findOne({'enddate':days }).exec()
  },
  // 添加一个预定信息
  create: function create (bookinfo) {
    // id_array.push(bookinfo.id)
    return BookInfo.create(bookinfo).exec()
  },

  // 删除一个预订信息
  deleteInfoByid: function deleteInfoByid (id) {
    return BookInfo.deleteOne({ id: id }).exec()
  },

  deleteAll: function deleteAll() {
    BookInfo.remove({}).exec()
  },
}
