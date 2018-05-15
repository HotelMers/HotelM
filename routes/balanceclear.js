const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin
const EmptyRoomModel = require('../models/emptyRoomNumber')

// 删除预订信息

module.exports = {

  balanceclearPage: function (req, res, next) {
      res.render('balance')
  },

  balanceclearSubmit: function (req, res, next) {
    // 更新剩余空房数据库（日期-1）
    var updateDate = EmptyRoomModel.update();

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var time_in_num= year*10000+month*100+day;

<<<<<<< HEAD
<<<<<<< HEAD
    for (var i = time_in_num-7; i < time_in_num; i++) {
=======
    for (var i = time_in_num-7 ; i < time_in_num; i++) {
>>>>>>> master
=======
    for (var i = 0; i < ; i++) {
>>>>>>> parent of f10baab... fix bug
      BookModel.getBookinfoByEnddates(i)
        .then(function(result) {
            if (result.enddate< time_in_num) {
              BookModel.deleteInfoByid(result.id)
                .then(function(result1) {
                    if (result1.deletedCount>=1) {
                      req.flash('success', '成功删除过期预订信息')
                      return res.redirect('/manage')
                    }
              })
            }
            req.flash('success', '成功删除过期预订信息')
            return res.redirect('/manage')
        })
    }
  }
}