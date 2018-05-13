const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const BookModel = require('../models/bookInfo')
const emptyRoomNumber = require('../models/emptyRoomNumber')
const DateHelper = require('../middlewares/dateHelper')

// var toDate = function(stringDate) {
//     var stringDate= Number(stringDate);

//     // 初始化方法 new Date(yyyy,month,dd)
//     // start_date
//     var year= stringDate/ 10000;
//     var month= (stringDate% 10000)/ 100;
//     var day= (stringDate% 10000)% 100;
//     var date1= new Date()
//     date1.setFullYear(year,month,day)
//     return date1;
//   }
  
module.exports = {
  bookroomPage: function(req, res) {
    res.render("bookroom");
  },
  
  bookroomSubmit: function (req, res, next) {
    const id = req.fields.idcard
    const name = req.fields.name
    const score = req.fields.score
    const phone = req.fields.phone
    const roomtype = req.fields.roomtype
    const startdate = req.fields.starttime
    const enddate = req.fields.endtime


    // 校验参数
    try {
      if (!id.length || isNaN(id)) {
        throw new Error('请填写身份证:数字')
      }
      if (!roomtype.length || (roomtype!= "单人房"&&roomtype!= "双人房"&&roomtype!= "大房")) {
        throw new Error('房间类型填写有误，正确格式为：单人房/双人房/大房')
      }
      if (!score.length || isNaN(score)) {
        throw new Error('积分填写有误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    // 将时间转换为 date

    // var date_start= toDate(startdate)
    // var date_end= toDate(enddate)
    // console.log(date_start)

    // 待写入数据库的房间信息
    let bookinfo = {
        id: id,
        name: name,
        phone: phone,
        type: roomtype,
        startdate: Number(startdate),
        enddate: Number(enddate)
      }

    var begindays= new Number(startdate)
    begindays= begindays% 100;
    var finaldays= new Number(enddate)
    finaldays= finaldays% 100;
    var month_temp= new Number(startdate)
    month_temp= (month_temp/ 100)%100;

    // var startdays= toDate(startdate)
    // var enddays= toDate(enddate)

    
    // emptyRoomNumber.reduceNumberBetweenDaysByType(startdays,enddays,roomtype)
    for (var i = begindays; i < finaldays; i++) {
      emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
    }
    
    req.flash('success', month_temp+'操作成功')

      // 用户信息写入数据库
    BookModel.create(bookinfo)
        .then(function (result) {
          req.flash('success', '预定成功')
          // req.flash('success', startdate)
          res.redirect('/manage')
        })
        .catch(function (e) {
          // 预定失败
          req.flash('error', '预定失败')
          return res.redirect('/bookroom')
          next(e)
        }) 
        
    // 一个月内

  }
}
