const express = require('express')
const router = express.Router()
const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')
const dateHelper = require('../middlewares/dateHelper')

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
      		var today = dateHelper.getDateAfterDays(dayoffset);
      		Numbers[dayoffset].days=(today.getMonth()+1)+"月"+(today.getDate())+"日";
      	})(i)
      }
      res.render('manage',{numbers:Numbers})
    })
    
  },

}
