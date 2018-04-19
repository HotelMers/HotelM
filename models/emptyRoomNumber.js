const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const RoomModel = require('../models/rooms')

module.exports = {
  // 通过天数获得改天的剩余房间量
  getEmptyRoomNumberByDays: function getEmptyRoomNumberByDays (days) {
    return EmptyRoomNumber
      .findOne({ days: days })
      .addCreatedAt()
      .exec()
  },

  // 增加一天的记录
  create: function create (days) {
  	var AllNumber = RoomModel.getAllRoomNumber();
  	var number = {days:days,bigRoom:AllNumber.bigRoom,singleRoom:AllNumber.singleRoom,doubleRoom:AllNumber.doubleRoom};
    EmptyRoomNumber.create(number).exec()
  },

  // 左移一天
  update: function update() {
  	if (EmptyRoomNumber.findOne({ days: 0 }))
		EmptyRoomNumber.delete({ days: 0 }).exec()
  	for (var i = 1; i <= 30; i++) {
  		if (EmptyRoomNumber.findOne({ days: i })) {
  			EmptyRoomNumber.findOne({ days: i }).update({ days: i-1 })
  		} else {
  			create(i);
  		}
  	}
  },

  // 减少某个房间类型的数量  reduceNumberByTypeAndDays
  reduceNumberByDaysAndType: function reduceNumberByTypeAndDays(days,type) {
  	var num = EmptyRoomNumber.findOne({ days: days });
  	if (type == "big") {
  		EmptyRoomNumber.update({ days: days },{$set:{bigRoom:num.bigRoom-1}})
  	} else if (type == "single") {
  		EmptyRoomNumber.update({ days: days },{$set:{singleRoom:num.singleRoom-1}})
  	} else if (type == "double") {
  		EmptyRoomNumber.update({ days: days },{$set:{doubleRoom:num.bigRdoubleRoomoom-1}})
  	}
  },

}
