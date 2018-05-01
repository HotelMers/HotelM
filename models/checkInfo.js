const CheckInfo = require('../lib/mongo').CheckInfo
const Room = require('../lib/mongo').room

module.exports = {
  // 通过客户id获取入住信息
  getCheckInfoById: function getCheckInfoById (id) {
    return CheckInfo
      .findOne({ CustomerId: id })
      .addCreatedAt()
      .exec()
  },

  // 通过房间号获取入住信息
  getCheckInfoByRoom: function getCheckInfoByRoom (number) {
    return CheckInfo
      .findOne({ RoomNumber: number })
      .addCreatedAt()
      .exec()
  },

  // 添加一个入住信息
  create: function create (customer) {
    return CheckInfo.create(customer).exec()
  },

  // 通过房间号删除一个入住信息
  delCheckInByRoom: function delCheckInByRoom (number) {
    return Room.deleteOne({ RoomNumber: number }).exec()
  }
}
