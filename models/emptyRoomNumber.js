const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber

module.exports = {
  // 通过天数获得改天的剩余房间量
  getEmptyRoomNumberByDays: function getEmptyRoomNumberByDays (days) {
    return EmptyRoomNumber
      .findOne({ days: days })
      .addCreatedAt()
      .exec()
  },

  // 增加一天的记录
  create: function create (number) {
    return EmptyRoomNumber.create(number).exec()
  },

  // 左移一天
  update: function update() {

  },

  // 减少某个房间类型的数量  未完成
  reduceNumberByDaysAndType: function reduceNumberByTypeAndDays(days,type) {
  	var num = EmptyRoomNumber.findOne({ days: days });
  	if (type == "big") {
  		EmptyRoomNumber.findOne({ days: days });.update({bigRoom:num.bigRoom-1})
  	} else if (type == "single") {
  		EmptyRoomNumber.findOne({ days: days });.update({singleRoom:num.singleRoom-1})
  	} else if (type == "double") {
  		EmptyRoomNumber.findOne({ days: days });.update({doubleRoom:num.doubleRoom-1})
  	}
  },

}
