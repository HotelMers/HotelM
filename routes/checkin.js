const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const CheckInfoModel = require('../models/checkInfo')
const RoomModel = require('../models/rooms')
const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const checkLogin = require('../middlewares/check').checkLogin

module.exports = {
  // GET
  checkInPage: function (req, res) {
    var bookinfo = { id :"", name: "", score : "", phone: ""};
    var customer = {id:"", name:"", score:"", phone:""};
    res.render('checkin', { customer : customer, bookinfo : bookinfo })
  },

  // post 查找用户是否预订
  checkInBookSubmit: function(req, res, next) {
    const id = req.fields.idcard
  
    // 校验参数
    try {
      if (id.length != 18) {
        throw new Error('无效身份证号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/checkin')
    }

    BookModel.getBookInfoById(id)
      .then(function (customer) {
        if (!customer) {
          req.flash('error', '预定信息不存在')
          return res.redirect('/checkin')
        }
        req.flash('success', '查询成功')
        res.render('checkin',{customer:customer,bookinfo:bookinfo})
      })
      
  },

  // post 查找用户是否是会员
  // checkin的ejs页面暂时没有用到“查找用户是否是会员”
  checkInVIPSubmit: function(req, res, next) {
    return res.redirect('/searchcus')
  },


  // get /checkin/getRoom 添加房间
  addroomPage: function(req, res) {
    res.render("addroom");
  },


  // post 非预定用户入住写入入住信息数据库(待完成)
  checkInWrite: function(req, res, next) {
    const CustomerId = req.fields.idcard
    const name = req.fields.name
    const phone = req.fields.phone
    const price = req.fields.price
    const RoomNumber = req.fields.RoomNumber
    const startdate = req.fields.startdate
    const enddate = req.fields.enddate
    const roomtype = req.fields.roomtype

    // 查询该房间号是否被管理员创建过
    isValidRoomNumberFlag = false
    RoomModel.getRoomByNumber(RoomNumber)
    .then(function (room) {
        if (!room) {
          req.flash('error', '房间号不存在')
        }
        isValidRoomNumberFlag = true
      })

    // 校验参数
    try {
      if (CustomerId.length != 18) {
        throw new Error('无效身份证号')
      }
      if (phone.length != 11) {
        throw new Error('无效手机号')
      }
      if (!isValidRoomNumberFlag) {
        throw new Error('无效房间号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    // 待写入数据库的入住信息
    let customer = {
      id : id,
      name: name,
      score : score,
      phone : phone,
      price : price
      RoomNumber : RoomNumber
      startdate : startdate
      enddate : enddate
      roomtype : roomtype
    }

    // 入住信息写入数据库
    CheckInfoModel.create(checkInfo)
      .then(function (result) {
        req.flash('success', '添加顾客成功')
        res.redirect('/checkin')
      })
      .catch(function (e) {
        // 入住信息已存在，跳回checkIn
        if (e.message.match('duplicate key')) {
          req.flash('error', '入住信息已存在')
          return res.redirect('/checkin')
        }
        next(e)
    }) 

    // 更新剩余空房数据库，相应类型客房数量-1
    EmptyRoomModel.reduceNumberByDaysAndType(roomtype)
    // 写入 flash
    req.flash('success', '客房数量-1成功')

  }

}

