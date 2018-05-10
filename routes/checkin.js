const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const CheckInfoModel = require('../models/checkInfo')
const RoomModel = require('../models/rooms')
const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const checkLogin = require('../middlewares/check').checkLogin

const DateHelper = require('../middlewares/dateHelper')

const BookRoom = require('/bookroom')

module.exports = {
  // GET
  checkInPage: function (req, res) {
    var bookinfo = { id :"", name: "", score : "", phone: ""};
    var customer = {id:"", name:"", score:"", phone:""};
    res.render('checkin', { customer : customer, bookinfo : bookinfo })
  },

  // // post 查找用户是否预订
  // // 重定向传参数问题
  // checkInBookSubmit: function(req, res, next) {
  //   const id = req.fields.idcard
  //   // 校验参数
  //   try {
  //     if (id.length != 18) {
  //       throw new Error('无效身份证号')
  //     }
  //   } catch (e) {
  //     req.flash('error', e.message)
  //     return res.redirect('/checkin')
  //   }
  //   BookModel.getBookInfoById(id)
  //     .then(function (customer) {
  //       if (!customer) {
  //         var session = req.session;
  //         req.flash('error', '预定信息不存在')
  //         return res.redirect('/checkin?idcard=id')
  //       }
  //       req.flash('success', '查询成功')
  //       res.redirect('checkin',{customer:customer,bookinfo:bookinfo})
  //     })
      
  // },

  // // post 查找用户是否是会员
  // // checkin的ejs页面暂时没有用到“查找用户是否是会员”
  // checkInVIPSubmit: function(req, res, next) {
  //   return res.redirect('/searchcus')
  // },

  // post 非预定用户入住写入入住信息数据库(待完成)
  checkInWrite: function(req, res, next) {
    const CustomerId = req.fields.idcard
    const name = req.fields.name
    const phone = req.fields.phone
    const price = req.fields.price
    const RoomNumber = req.fields.RoomNumber
    const startdate = BookRoom.toDate(req.fields.starttime.toString())
    const enddate = BookRoom.toDate(req.fields.endtime.toString())
    const roomtype = req.fields.roomtype

    // 校验参数
    try {
      if (CustomerId.length != 18) {
        throw new Error('无效身份证号')
      }
      if (phone.length != 11) {
        throw new Error('无效手机号')
      }
      if (!RoomModel.getRoomByNumber(RoomNumber)) {
        throw new Error('无效房间号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
      next(e)
    }

    // 待写入数据库的入住信息
    let checkInfo = {
      CustomerId : CustomerId,
      name: name,
      phone : phone,
      RoomNumber : RoomNumber,
      startdate : startdate,
      enddate : enddate
    }

    // 入住信息写入数据库
    CheckInfoModel.create(checkInfo)
      .then(function (result) {
        req.flash('success', '添加入住信息成功')
        res.redirect('/checkin')
      })
      .catch(function (e) {
        // 入住信息已存在，跳回checkIn
        // ？？？不会处理一个人预定多条
        if (e.message.match('duplicate key')) {
          req.flash('error', '入住信息已存在')
          return res.redirect('/checkin')
        }
        next(e)
    }) 


    // 更新剩余空房数据库，相应类型客房数量-1
    var days = DateHelper.dayoffsetBetweenTwoday(startdate, enddate)
    EmptyRoomModel.reduceNumberByDaysAndType(days, roomtype)
    // 写入 flash
    req.flash('success', '客房数量-1成功')

  },

  // // post 获得房间号(待完成)
  // checkInGetRoom: function(req, res, next) {
  //   const roomtype = req.fields.roomtype

  //   // // 获取当前日期时间
  //   // var myDate = new Date();
  //   // var year = myDate.getFullYear();    //获取完整的年份(4位)
  //   // var month = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
  //   // var day = myDate.getDate();        //获取当前日(1-31)
  //   //rooms = getEmptyRoomNumberByDays(year, month, day)

  //   rooms = getRoomIdByType(roomtype).number
  //   $("#RoomNumber").val("rooms[0].toString()")
  //   //req.flash('success', '房号为'+rooms[0].toString())
  //   //res.redirect('/checkin')

  //   checkInWrite()
  // }

}
