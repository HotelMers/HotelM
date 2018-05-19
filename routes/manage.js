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
        Numbers = {month: -1, day:-1,bigRoom:-1,singleRoom:-1,doubleRoom:-1}
      }
      Numbers = numbers;
      for (var i = 0; i < 30 && i < Numbers.length;i++) {
      	(function(dayoffset) {
      		Numbers[dayoffset].days=Numbers[dayoffset].month+"月"+Numbers[dayoffset].day+"日";
      	})(i)
      }
      res.render('manage',{numbers:Numbers})
    })
    
  },

  clear: function clear(req, res) {
    EmptyRoomModel.deleteAll();
    res.redirect('manage');
  },

}
