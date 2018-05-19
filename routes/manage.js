const express = require('express')
const router = express.Router()
const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')
const bi = require('../models/bookInfo')
const ci = require('../models/checkInfo')
const customers = require('../models/customers')

module.exports = {
  managePage: function managePage(req, res) {
    EmptyRoomModel.getAllEmptyRoomNumber()
    .then(function(numbers) {
      var Numbers
      if (!numbers) {
        Numbers = {month: -1, day:-1,bigRoom:-1,singleRoom:-1,doubleRoom:-1}
      }
      Numbers = numbers;
      for (var i = 0; i < 30 && i < Numbers.length;i++) {
       (function(dayoffset) {
         Numbers[dayoffset].days=Numbers[dayoffset].month+"月"+Numbers[dayoffset].day+"日";
          Numbers[dayoffset].bigRoom=Numbers[dayoffset].bigRoom+" * "+Numbers[dayoffset].bigPrice+"元"
          Numbers[dayoffset].singleRoom=Numbers[dayoffset].singleRoom+" * "+Numbers[dayoffset].singlePrice+"元"
          Numbers[dayoffset].doubleRoom=Numbers[dayoffset].doubleRoom+" * "+Numbers[dayoffset].doublePrice+"元"
       })(i)
      }
      res.render('manage',{numbers:Numbers})
    })//.then(function(){
    //   res.render('manageroom',{rooms:rooms})
    // })
    
  },

  clear: function clear(req, res) {
    EmptyRoomModel.deleteAll();
    customers.deleteAll();
    bi.deleteAll();
    ci.deleteAll();
    RoomModel.deleteAll();
    res.redirect('manage');
  },

}
