const Room = require('../lib/mongo').Room

module.exports = {
  // 通过房间号获取房间信息
  getRoomByNumber: function getRoomByNumber (number) {
    return Room
      .findOne({ number: number })
      .addCreatedAt()
      .exec()
  },

  // 添加一个房间
  create: function create (room) {
    return Room.create(room).exec()
  }
}