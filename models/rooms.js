const Room = require('../lib/mongo').Room

module.exports = {
  // 通过房间号获取房间信息
  getRoomByNumber: function getRoomByNumber (number) {
    return Room.findOne({ number: number }).exec()
  },

  // 获取所有房间信息
  getAllRoomInfo: function getAllRoomInfo () {
    return Room.find()
  },

  // 添加一个房间
  create: function create (room) {
    return Room.create(room).exec()
  },

  // 通过number删除一个房间
  delRoomById: function delRoomById (number) {
    return Room.deleteOne({ number: number }).exec()
  },

  // 获得各种类型房间的总数
  getAllRoomNumber: function getAllRoomNumber () {
    // 待完成
  },

  // 根据房间类型获得一个空房号
  getRoomIdByType: function getRoomIdByType (type) {
    // 待完成
  }

}
