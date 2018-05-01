const express = require('express')
const router = express.Router()
const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')

module.exports = {
  managePage: function(req, res) {
    // RoomModel.getSingleRoomNumber().then(function(snum) {
    // 	numbers = {singleNumber:snum,doubleNumber:0,bigNumber:0}
    // 	RoomModel.getDoubleRoomNumber().then(function(dnum) {
    // 		numbers.doubleNumber = dnum
    // 		RoomModel.getBigRoomNumber().then(function(bnum) {
	   //  		numbers.bigNumber = bnum



				// res.render('manage',{numbers:numbers})
	   //  	})
    // 	})
    // })


    EmptyRoomModel.getAllEmptyRoomNumber()
    .then(function (numbers) {
      var Numbers
      if (!numbers) {
        Numbers = {days:-1,bigRoom:-1,singleRoom:-1,doubleRoom:-1}
      }
      Numbers = numbers;
      // if (!Numbers.singleRoom)
      // 	Numbers.singleRoom = 999
      res.render('manage',{numbers:Numbers})
    })

    
  }
}
