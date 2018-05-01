const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const RoomModel = require('../models/rooms')

module.exports = {
  // 通过天数获得该天的剩余房间量
  getEmptyRoomNumberByDays: function getEmptyRoomNumberByDays (days) {
    return EmptyRoomNumber.findOne({ days: days }).exec()
  },

  initializeEmptyRoomNumber: function initializeEmptyRoomNumber () {
    for (var i = 0; i < 30; i++) {
      (function (day) {
        EmptyRoomNumber.find({days:day}).then(function(nums) {
          if (nums.length==0) {
            module.exports.create(day);
          }
        })
      })(i);
    }
  },

  // 获得30天内的剩余房间量
  getAllEmptyRoomNumber: function getAllEmptyRoomNumber () {
    EmptyRoomNumber.find().then(function(day) {
      if (day.length != 30) {
        module.exports.initializeEmptyRoomNumber();
      }
    })
    
    // module.exports.deleteAll();
    // module.exports.update();

    return EmptyRoomNumber.find().sort({"days":1});
  },

  // 增加一天的记录
  create: function create (days) {
    RoomModel.getSingleRoomNumber().then(function(snum) {
      numbers = {days:days,singleRoom:snum,doubleRoom:0,bigRoom:0}
      RoomModel.getDoubleRoomNumber().then(function(dnum) {
        numbers.doubleRoom = dnum
        RoomModel.getBigRoomNumber().then(function(bnum) {
          numbers.bigRoom = bnum
          EmptyRoomNumber.create(numbers).exec()
        })
      })
    })
  },

  // 左移一天 在日结的时候调用
  update: function update() {
  	EmptyRoomNumber.find({ days: 0 }).then(function(days0){
      if (days0.length !== 0) {
        EmptyRoomNumber.deleteOne({ days: 0 }).exec()
      }
      for (var i = 1; i < 30; i++) {
        (function(day) {
          EmptyRoomNumber.find({ days: day}).then(function(num) {
            if (num.length!=0) {
               EmptyRoomNumber.updateOne({ days: day}, {$set:{'days':day-1}}).exec()
            } else {
              module.exports.create(day-1);
            }
          })
        })(i)
      }
      module.exports.create("29");
    })
  },

  // 减少某天某个房间类型的数量  预定时调用/无预定入住时调用（入住时days应传入0）参数days是number,type是string
  reduceNumberByDaysAndType: function reduceNumberByTypeAndDays(days,type) {
  	EmptyRoomNumber.findOne({ days: days }).then(function(num) {
      if (type == "大房") {
        EmptyRoomNumber.update({ 'days': days },{$set:{'bigRoom':num.bigRoom-1}}).exec()
      } else if (type == "单人房") {
        EmptyRoomNumber.update({ 'days': days },{$set:{'singleRoom':num.singleRoom-1}}).exec()
      } else if (type == "双人房") {
        EmptyRoomNumber.update({ 'days': days },{$set:{'doubleRoom':num.doubleRoom-1}}).exec()
      }
    })
  },

  // 增加某天某个房间类型的数量  取消预定时调用/退房时调用（退房时days应传入0）参数days是number,type是string
  addNumberByDaysAndType: function addNumberByDaysAndType(days,type) {
    EmptyRoomNumber.findOne({ days: days }).then(function(num) {
      if (type == "大房") {
        EmptyRoomNumber.update({ 'days': days },{$set:{'bigRoom':num.bigRoom+1}}).exec()
      } else if (type == "单人房") {
        EmptyRoomNumber.update({ 'days': days },{$set:{'singleRoom':num.singleRoom+1}}).exec()
      } else if (type == "双人房") {
        EmptyRoomNumber.update({ 'days': days },{$set:{'doubleRoom':num.doubleRoom+1}}).exec()
      }
    })
  },

  // 增加某个房间类型的数量  管理客房中增加客房时调用
  addNumberByType: function addNumberByType(type) {
    for(var i = 0; i < 30; i++) {
      (function(day) {
        module.exports.addNumberByDaysAndType(day,type);
      })(i);
    }
  },

  // 减少某个房间类型的数量  管理客房中减少客房时调用
  reduceNumberByType: function reduceNumberByType(type) {
    for(var i = 0; i < 30; i++) {
      (function(day) {
        module.exports.reduceNumberByDaysAndType(day,type);
      })(i);
    }
  },

  deleteAll: function deleteAll() {
    EmptyRoomNumber.remove({}).exec()
  },
}
