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
  },

  // 通过number删除一个房间
  delRoomById: function delRoomById (number) {
    return Room.deleteOne({ number: number }).exec()
  }

}
