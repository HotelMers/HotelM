const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
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
    // var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, score: req.query.score,phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render("bookroom",{ customer : customer, bookinfo : bookinfo});
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
      if (id.length!= 18 || isNaN(id)) {
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
    

    var begindays= new Number(startdate)
    begindays= begindays% 100;
    var finaldays= new Number(enddate)
    finaldays= finaldays% 100;
    var month_temp= new Number(startdate)
    month_temp= (month_temp/ 100)%100;

    if (begindays> finaldays) {
        url = '/bookroom?idcard='+id.toString()+'&name='+name.toString()+'&score='+score.toString()+'&phone='+phone.toString()
            +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
        req.flash('error', 'you fill the wrong time')
        return res.redirect(url)
        // return res.redirect('/bookroom')
    }

    // var startdays= toDate(startdate)
    // var enddays= toDate(enddate)

    
    // 先查询是否还有空房,有空房才进行相关操作
    for (var i = begindays; i < finaldays; i++) {
        // 
      emptyRoomNumber.getEmptyRoomNumberByDays(2018,Math.round(month_temp),i)
        .then(function(result) {
            if (roomtype== '单人房') {
                if (result.singleRoom>= 1) {
                    emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                } else {
                    req.flash('error', '没有足够的单人房房间')
                    return res.redirect('/manage')
                }
            } else if (roomtype== '大床房') {
                if (result.bigRoom>= 1) {
                    emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                } else {
                    req.flash('error', '没有足够的big房间')
                    return res.redirect('/manage')
                }
            } else if (roomtype== '双人房') {
                if (result.doubleRoom>= 1) {
                    emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                } else {
                    req.flash('error', '没有足够的double房间')
                    return res.redirect('/manage')
                }
            }

        })
    }
    
    // req.flash('success', '操作成功')

    let customer = {
        id: id,
        name: name,
        score:score,
        phone: phone
    }
    // 按照身份证填写客户信息
    CusModel.getCusById(id)
      .then(function(result) {
        if (!result) {
          // result= {id: -1, name:-1, score:-1, phone:-1}
                url = '/bookroom?idcard='+id.toString()+'&name='+name.toString()+'&score='+score.toString()+'&phone='+phone.toString()
                +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
                return res.redirect(url)
        }
        // req.flash('success', '会员查询成功')
        // 自动填充
        
        // return res.redirect(url)
      })

      // 用户信息写入数据库
    let bookinfo = {
        id: id,
        name: name,
        phone: phone,
        type: roomtype,
        startdate: Number(startdate),
        enddate: Number(enddate)
      }

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
// 