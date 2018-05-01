const express = require('express')
const router = express.Router()
const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')

module.exports = {
  managePage: function managePage(req, res) {
    EmptyRoomModel.getAllEmptyRoomNumber()
    .then(function (numbers) {
      var Numbers
      if (!numbers) {
        Numbers = {days:-1,bigRoom:-1,singleRoom:-1,doubleRoom:-1}
      }
      Numbers = numbers;
      for (var i = 0; i < 30 && i < Numbers.length;i++) {
      	(function(dayoffset) {
      		var today = module.exports.getDateAfterDays(dayoffset);
      		Numbers[dayoffset].days=(today.getMonth()+1)+"月"+(today.getDate())+"日";
      	})(i)
      }
      res.render('manage',{numbers:Numbers})
    })
    
  },

  // 辅助函数
  // 返回某个月份的日期数
  DaysInMonth: function DaysInMonth(month, year) {  // month [1,12]
	if (month == 1 || month == 3 || month == 5||month == 7|| month == 8|| month == 10|| month == 12)
		return 31;
	else if ( month == 4 || month == 6|| month == 9|| month == 11)
		return 30;
	else if ( month == 2)
		if (year % 4 == 0 && year % 100 != 0)
			return 29;
		else
			return 28;
	else
		return 0;
  },

  // 返回当天过后dayoffset天的日期
  getDateAfterDays: function getDateAfterDays (dayoffset) {
  	var today = new Date();
  	var date = today.getDate()+dayoffset;
	var month = today.getMonth(); // month [0,11]
	var year = today.getFullYear();
	if (date > module.exports.DaysInMonth(month+1,year)) {
		date = date-module.exports.DaysInMonth(month+1,year);
		month++;
		if (month > 11) {
			month = 0;
		}
	}
	today.setDate(date);
	today.setMonth(month);
	return today;
  },
}
