const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const RoomModel = require('../models/rooms')
const dateHelper = require('../middlewares/dateHelper')

module.exports = {
  // 通过月日获得该天的剩余房间量 month, day都是number，表示月/日
  getEmptyRoomNumberByDays: function getEmptyRoomNumberByDays (year, month, day) {
    return EmptyRoomNumber.findOne({'year':year, 'month': month, 'day':day }).exec()
  },

  initializeEmptyRoomNumber: function initializeEmptyRoomNumber () {
    var tasks = [];
    var today = new Date();
    for (var i = 0; i < 30; i++) {
      (function (dayoff) {
        var date = dateHelper.getDateAfterDays(today,dayoff); 
        EmptyRoomNumber.find({'year':date.year,'month': date.month, 'day':date.day}).then(function(nums) {
          if (nums.length==0) {
            tasks.push(module.exports.create(date.year, date.month, date.day))
          }
        })
      })(i);
    }
    while (tasks.length > 0){
      tasks.shift()();
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
    return EmptyRoomNumber.find().sort({"year":1,"month":1,"day":1});
  },

  // 增加一天的记录
  create: function create (year,month,day) {
    RoomModel.getSingleRoomNumber().then(function(snum) {
      numbers = {year:year,month:month,day:day,singleRoom:snum,doubleRoom:0,bigRoom:0}
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
    var today = new Date();
  	EmptyRoomNumber.find().then(function(nums){
      
    })
  },

  // 减少某天某个房间类型的数量  预定时调用/无预定入住时调用
  reduceNumberByDaysAndType: function reduceNumberByTypeAndDays(year,month,day,type) {
  	EmptyRoomNumber.findOne({'year':year,'month': month, 'day':day}).then(function(num) {
      if (type == "大房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'bigRoom':num.bigRoom-1}}).exec()
      } else if (type == "单人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'singleRoom':num.singleRoom-1}}).exec()
      } else if (type == "双人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'doubleRoom':num.doubleRoom-1}}).exec()
      }
    })
  },

  // 增加某天某个房间类型的数量  取消预定时调用/退房时调用（退房时days应传入0）参数days是number,type是string
  addNumberByDaysAndType: function addNumberByDaysAndType(year,month,day,type) {
    EmptyRoomNumber.findOne({'year':year,'month': month, 'day':day}).then(function(num) {
      if (type == "大房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'bigRoom':num.bigRoom+1}}).exec()
      } else if (type == "单人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'singleRoom':num.singleRoom+1}}).exec()
      } else if (type == "双人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'doubleRoom':num.doubleRoom+1}}).exec()
      }
    })
  },

  // 增加某个房间类型的数量  管理客房中增加客房时调用
  addNumberByType: function addNumberByType(type) {
    var today = new Date();
    for(var i = 0; i < 30; i++) {
      (function(dayoff) {
        date = dateHelper.getDateAfterDays(today,dayoff)
        module.exports.addNumberByDaysAndType(date.year,date.month,date.day,type);
      })(i);
    }
  },

  // 减少某个房间类型的数量  管理客房中减少客房时调用
  reduceNumberByType: function reduceNumberByType(type) {
    var today = new Date();
    for(var i = 0; i < 30; i++) {
      (function(dayoff) {
        date = dateHelper.getDateAfterDays(today,dayoff)
        module.exports.reduceNumberByDaysAndType(date.year,date.month,date.day,type);
      })(i);
    }
  },

  deleteAll: function deleteAll() {
    EmptyRoomNumber.remove({}).exec()
  },
}
