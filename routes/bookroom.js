const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const checkLogin = require('../middlewares/check').checkLogin
const BookModel = require('../models/bookInfo')
const emptyRoomNumber = require('../models/emptyRoomNumber')
const DateHelper = require('../middlewares/dateHelper')
  
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
    // 获取当前日期时间，用于和入住日期进行比较，避免入住日期早于当前日期
    var today = DateHelper.todayTostring();

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
      if (startdate.length != 8) {
        throw new Error('入住时间格式错误！正确格式为：（8位阿拉伯数字表示）YYYYMMDD')
      }
      if (enddate.length != 8) {
        throw new Error('退房时间格式错误！正确格式为：（8位阿拉伯数字表示）YYYYMMDD')
      }
      if (Number(startdate)-Number(enddate) > 0) {
        throw new Error('退房时间不能早于入住时间!')
      }
      if (Number(today)-Number(startdate) > 0) {
        throw new Error('入住时间不能早于今日!')
      }
      var endayoffset = Number(DateHelper.dayoffsetBetweenTwoday(new Date(), DateHelper.toDate(enddate)))
      if (endayoffset > 30) {
        throw new Error('不能登记超过30天的预定')
      } 
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    // 先查询是否还有空房,有空房才进行相关操作,
    var offset = Number(DateHelper.dayoffsetBetweenTwoday(DateHelper.toDate(startdate), DateHelper.toDate(enddate)))
    var hasRoom = true;
    for (var i = 0; i < offset; i++) {
      (function (i, res, req) {
        var date = DateHelper.getDateAfterDays(DateHelper.toDate(startdate),i);
　　    emptyRoomNumber.getEmptyRoomNumberByDays(date.year,date.month,date.day)
        .then(function(result) {
            if ((roomtype== '单人房' && result.singleRoom <= 0) ||
                (roomtype== '大床房' && result.bigRoom <= 0) || 
                 (roomtype== '双人房' && result.doubleRoom <= 0) ) {
                hasRoom = false;
                throw new Error('没有足够的房间')
                return res.redirect('/manage')
            }
        }).catch(function(e) {
          req.flash('error', e.message)
          return res.redirect('/manage')
        })
      })(i, res, req);
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
      //检查完有空房，将空房数量-1
      if (hasRoom) {
        emptyRoomNumber.reduceNumberBetweenDaysByType(DateHelper.toDate(startdate), DateHelper.toDate(enddate), roomtype)
        req.flash('success', '预定：'+roomtype+'数量-1')
      }
      req.flash('success', '入住时间：'+startdate+',退房时间：'+enddate+',预定成功')
      // req.flash('success', begindays)
      res.redirect('/manage')
    })
    .catch(function (e) {
      // 预定失败
      req.flash('error', '预定失败')
      req.flash('error', e.message)
      return res.redirect('/bookroom')
      next(e)
    }) 
  }

}