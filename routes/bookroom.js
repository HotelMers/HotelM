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
  // get，查询会员前
  bookroomPage: function(req, res) {
    // var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, score: req.query.score,phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('bookroom',{ customer : customer, bookinfo : bookinfo});
  },
  // post
  bookroomSubmit: function (req, res, next) {
    
    // req.flash('success', '操作成功')
    const id = req.fields.idcard
    // let customer = {
    //     id: id,
    //     name: name,
    //     score:score,
    //     phone: phone
    // }
    // 按照身份证填写客户信息
    CusModel.getCusById(id)
      .then(function(result) {
        if (!result) {
          // result= {id: -1, name:-1, score:-1, phone:-1}
          req.flash('error', '该会员不存在')   
          url = '/bookroom?idcard='+id.toString()
          return res.redirect(url)   
        } else {
          url = '/bookroom?idcard='+id.toString()+'&name='+(result.name).toString()+'&score='+(result.score).toString()+'&phone='+(result.phone).toString()
          req.flash('success', '该会员存在')
          return res.redirect(url)
        }
        // req.flash('success', '会员查询成功')
        // 自动填充
        
        // return res.redirect(url)
      })

      

  },

  bookroomPageHascustomers: function(req, res) {
    // var roomnum = req.query.RoomNumber
    var customer = {id:req.query.idcard, name:req.query.name, score: req.query.score,phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('bookroom',{ customer : customer, bookinfo : bookinfo});
  },

  bookroomSubmitHascustomers: function (req, res, next) {
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
    var begindays1= begindays% 100

    var finaldays= new Number(enddate)
    var finaldays1= finaldays% 100

    var month_temp_x= new Number(startdate)
    var month_temp= (month_temp_x/ 100)%100

    var month_temp1_y= new Number(enddate)
    var month_temp1= (month_temp1_y/ 100)%100

    var ruzhu_day= month_temp*100 + begindays1
    var tuifang_day = month_temp1*100 +finaldays1

    if (ruzhu_day> tuifang_day) {
        url = '/bookroom?idcard='+id.toString()+'&name='+name.toString()+'&score='+score.toString()+'&phone='+phone.toString()
            +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
        req.flash('error', 'you fill the wrong time')
        return res.redirect(url)
        // return res.redirect('/bookroom')
    }

    // var startdays= toDate(startdate)
    // var enddays= toDate(enddate)

    
    // 先查询是否还有空房,有空房才进行相关操作,同月
    // req.flash('error', month_temp)
    // req.flash('error', month_temp1)
    // req.flash('error', DateHelper.DaysInMonth(Math.round(month_temp1),2018))
    if (Math.round(month_temp)== Math.round(month_temp1)) {
      
        for (var i = begindays1; i < finaldays1; i++) {
         // req.flash('success', i)
         // var temp= i
          (function (i) {
      　　    emptyRoomNumber.getEmptyRoomNumberByDays(2018,Math.round(month_temp),i)
                  .then(function(result) {
                      if (roomtype== '单人房') {
                          if (result.singleRoom> 0) {
                             // req.flash('error', temp)
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的单人房房间')
                              return res.redirect('/manage')
                          }
                      } else if (roomtype== '大床房') {
                          if (result.bigRoom> 0) {
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的大房')
                              return res.redirect('/manage')
                          }
                      } else if (roomtype== '双人房') {
                          if (result.doubleRoom> 0) {
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的双人房')
                              return res.redirect('/manage')
                          }
                      }

                  })
          })(i);
        }
    } else { // 先查询是否还有空房,有空房才进行相关操作,bu同月
        for (var i = begindays1; i <= DateHelper.DaysInMonth(Math.round(month_temp),2018); i++) {
          // req.flash('error', 2)
          (function (i) {
      　　    emptyRoomNumber.getEmptyRoomNumberByDays(2018,Math.round(month_temp),i)
                  .then(function(result) {
                      if (roomtype== '单人房') {
                          if (result.singleRoom> 0) {
                             // req.flash('error', i)
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的单人房房间')
                              return res.redirect('/manage')
                          }
                      } else if (roomtype== '大床房') {
                          if (result.bigRoom> 0) {
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的big房间')
                              return res.redirect('/manage')
                          }
                      } else if (roomtype== '双人房') {
                          if (result.doubleRoom> 0) {
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的double房间')
                              return res.redirect('/manage')
                          }
                      }

                  })
          })(i);
        }
        for (var i = 1; i < finaldays1; i++) {
            // 
          (function (i) {
      　　    emptyRoomNumber.getEmptyRoomNumberByDays(2018,Math.round(month_temp1),i)
                  .then(function(result) {
                      if (roomtype== '单人房') {
                          if (result.singleRoom> 0) {
                             // req.flash('error', i)
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp1),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的单人房房间')
                              return res.redirect('/manage')
                          }
                      } else if (roomtype== '大床房') {
                          if (result.bigRoom> 0) {
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp1),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的big房间')
                              return res.redirect('/manage')
                          }
                      } else if (roomtype== '双人房') {
                          if (result.doubleRoom> 0) {
                              emptyRoomNumber.reduceNumberByDateAndType(2018,Math.round(month_temp1),i,roomtype);
                          } else {
                              req.flash('error', '没有足够的double房间')
                              return res.redirect('/manage')
                          }
                      }

                  })
          })(i);
        }
    }
    
    

    // 用户信息写入数据库
    let bookinfo = {
        id: id,
        name: name,
        phone: phone,
        type: roomtype,
        startdate: Number(startdate),
        enddate: Number(enddate)
      }
      var temp= Number(startdate)
    BookModel.create(bookinfo)
        .then(function (result) {
          req.flash('success', '预定成功')
          // req.flash('success', begindays)
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