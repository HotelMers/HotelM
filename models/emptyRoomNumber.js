const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const RoomModel = require('../models/rooms')
const dateHelper = require('../middlewares/dateHelper')

module.exports = {
  // 通过月日获得该天的剩余房间量/房价 month, day都是number，表示月/日
  getEmptyRoomNumberByDays: function getEmptyRoomNumberByDays (year, month, day) {
    return EmptyRoomNumber.findOne({'year':year, 'month': month, 'day':day }).exec()
  },

  initializeEmptyRoomNumber: function initializeEmptyRoomNumber () {
    return Promise.resolve().then(function() {
      var today = new Date();
      for (var i = 0; i < 30; i++) {
        (function (dayoff) {
          var date = dateHelper.getDateAfterDays(today,dayoff); 
          EmptyRoomNumber.find({'year':date.year,'month': date.month, 'day':date.day}).then(function(nums) {
            if (nums.length==0) {
              module.exports.create(date.year, date.month, date.day)
            }
          })
        })(i);
      }
    }).then(function(){
      return Promise.resolve()
    });
  },

  // 获得30天内的剩余房间量
  getAllEmptyRoomNumber: function getAllEmptyRoomNumber () {
    return module.exports.initializeEmptyRoomNumber()
    .then(function(){
      return EmptyRoomNumber.find().sort({"year":1,"month":1,"day":1});
    })
  },

  // 增加一天的记录
  create: function create (year,month,day) {
    RoomModel.getSingleRoomNumber().then(function(snum) {
      numbers = {year:year,month:month,day:day,singleRoom:snum,doubleRoom:0,bigRoom:0,singlePrice:199,doublePrice:299,bigPrice:399}
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
    // 删除已过期的记录
    var today = new Date();
    var year= today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    EmptyRoomNumber.remove( { "year" : { $lt :year } } ).exec();
    EmptyRoomNumber.remove( { "year" :{$eq :year},"month":{ $lt :month } } ).exec();
    EmptyRoomNumber.remove( { "year" :{$eq :year},"month":{$eq :month}, "day": { $lt :day }  } ).exec();
    return {'year':year,'month': month, 'day':day} //返回日结的日期
  },

  // 减少某天某个房间类型的数量  预定时调用/无预定入住时调用 参数type是string,其他是number
  reduceNumberByDateAndType: function reduceNumberByDateAndType(year,month,day,type) {
  	EmptyRoomNumber.findOne({'year':year,'month': month, 'day':day}).then(function(num) {
      if (type == "大房" && num.bigRoom > 0) {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'bigRoom':num.bigRoom-1}}).exec();
      } else if (type == "单人房" && num.singleRoom > 0) {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'singleRoom':num.singleRoom-1}}).exec();
      } else if (type == "双人房" && num.doubleRoom > 0) {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'doubleRoom':num.doubleRoom-1}}).exec();
      }
    })
  },

  // 增加某天某个房间类型的数量  取消预定时调用/退房时调用  参数type是string,其他是number
  addNumberByDateAndType: function addNumberByDateAndType(year,month,day,type) {
    EmptyRoomNumber.findOne({'year':year,'month': month, 'day':day}).then(function(num) {
      if (type == "大房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'bigRoom':num.bigRoom+1}}).exec();
      } else if (type == "单人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'singleRoom':num.singleRoom+1}}).exec();
      } else if (type == "双人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'doubleRoom':num.doubleRoom+1}}).exec();
      }
    })
  },

  // 增加两个日期之间某个房间类型的数量  取消预定时调用/退房时调用
  // 参数startDate和endDate是date类型, 参数type是string类型
  addNumberBetweenDaysByType: function addNumberBetweenDaysByType(startDate,endDate,type) {
    var days = dateHelper.dayoffsetBetweenTwoday(startDate,endDate);
    for (var i = 0; i < days; i++) {
      (function (dayoff) {
        var date = dateHelper.getDateAfterDays(startDate,dayoff); 
        module.exports.addNumberByDateAndType(date.year,date.month,date.day,type);
      })(i);
    }
  },

  // 减少两个日期之间某个房间类型的数量  预定时调用/无预定入住时调用
  // 参数startDate和endDate是date类型, 参数type是string类型
  reduceNumberBetweenDaysByType: function reduceNumberBetweenDaysByType(startDate,endDate,type) {
    var days = dateHelper.dayoffsetBetweenTwoday(startDate,endDate);
    for (var i = 0; i < days; i++) {
      (function (dayoff) {
        var date = dateHelper.getDateAfterDays(startDate,dayoff); 
        module.exports.reduceNumberByDateAndType(date.year,date.month,date.day,type);
      })(i);
    }
  },

  // 增加某个房间类型的数量  管理客房中增加客房时调用
  addNumberByType: function addNumberByType(type) {
    var today = new Date();
    for(var i = 0; i < 30; i++) {
      (function(dayoff) {
        date = dateHelper.getDateAfterDays(today,dayoff)
        module.exports.addNumberByDateAndType(date.year,date.month,date.day,type);
      })(i);
    }
  },

  // 减少某个房间类型的数量  管理客房中减少客房时调用
  reduceNumberByType: function reduceNumberByType(type) {
    var today = new Date();
    for(var i = 0; i < 30; i++) {
      (function(dayoff) {
        date = dateHelper.getDateAfterDays(today,dayoff)
        module.exports.reduceNumberByDateAndType(date.year,date.month,date.day,type);
      })(i);
    }
  },

  hasEmptyRoomBetweenDaysByType: function hasEmptyRoomBetweenDaysByType(startDate,endDate,type) {
    // var offset = dateHelper.dayoffsetBetweenTwoday(startDate, endDate); 
    // for (var i = 0; i < offset; i++) {
    //   (function(dayoff) {
    //     var date = dateHelper.getDateAfterDays(startDate,dayoff);
    //     module.exports.getEmptyRoomNumberByDays(date.year,date.month,date.day).then(function(result) {
    //       if ((type == '单人房' && result.singleRoom > 0) ||
    //           (type == '双人房' && result.doubleRoom == 0) ||
    //           (type == '大房' && result.bigRoom == 0)) {
    //         // 这里应该返回'false'
    //       }
    //     })
    //   })(i)
    // }
  },

  // 修改某段时间内某种类型房间的房价
  // 参数startDate和endDate是date类型, 参数type是string类型
  updatePriceBetweenDaysByType: function updatePriceBetweenDaysByType(startDate,endDate,type,price) {
    var days = dateHelper.dayoffsetBetweenTwoday(startDate,endDate);
    if (days > 30) return false;
    for (var i = 0; i <= days; i++) {
      (function (dayoff) {
        var date = dateHelper.getDateAfterDays(startDate,dayoff); 
        module.exports.updatePriceByDateAndType(date.year,date.month,date.day,type,Number(price));
      })(i);
    }
  },

  // 修改某天某种类型房间的房价
  updatePriceByDateAndType: function updatePriceByDateAndType(year,month,day,type,price) {
    EmptyRoomNumber.findOne({'year':year,'month': month, 'day':day}).then(function(num) {
      if (type == "大房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'bigPrice':price}}).exec();
      } else if (type == "单人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'singlePrice':price}}).exec();
      } else if (type == "双人房") {
        EmptyRoomNumber.update({'year':year,'month': month, 'day':day},{$set:{'doublePrice':price}}).exec();
      }
    })
  },

  deleteAll: function deleteAll() {
    EmptyRoomNumber.remove({}).exec()
  },
}
