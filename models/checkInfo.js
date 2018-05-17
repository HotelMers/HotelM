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

  getCheckInfoByRoomandstatus: function getCheckInfoByRoom (number, isValid) {
    return CheckInfo
      .findOne({ RoomNumber: number, isValid: 1})
      .addCreatedAt()
      .exec()
  },

  //获取所有入住信息
  getAllCheckInfo: function getAllCheckInfo() {
    return CheckInfo.find().exec()
  },

  //通过起止时间获取入住信息
  getCheckInfoByTimeRange: function getCheckInfoByTimeRange(startdate,enddate) { 
    return CheckInfo
      .find({ "startdate" : {$gte:startdate}, "enddate":{$lte:enddate}})
      .exec()
  },

  // 添加一个入住信息
  create: function create (checkInfo) {
    // 要计算钱
    return CheckInfo.create(checkInfo).exec()
  },
  setvalidByRoomNumer: function setvalidByRoomNumer (number,startdate,enddate) {
    return CheckInfo.updateOne({'RoomNumber':Number(number), 'startdate':startdate, 'enddate':enddate},{$set:{'isValid':0}}).exec()
  },
  // 通过房间号删除一个入住信息
  delCheckInByRoom: function delCheckInByRoom (id) {
    return CheckInfo.deleteOne({ CustomerId: id }).exec()
  }
}
