const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const CheckInfoModel = require('../models/checkInfo')
const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')
const checkLogin = require('../middlewares/check').checkLogin
const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const DateHelper = require('../middlewares/dateHelper')

var toDate = function(stringDate) {
  var stringDate= Number(stringDate);

  // 初始化方法 new Date(yyyy,month,dd)
  // start_date
  var year= stringDate/ 10000;
  var month= (stringDate% 10000)/ 100;
  var day= (stringDate% 10000)% 100;
  return Date(year,month,day);
}

module.exports = {
  // GET
  checkInPage: function (req, res) {
    // 解析url，未处理完
    var customer = {id:req.query.idcard, name:req.query.name, phone:req.query.phone}
    var bookinfo = { id :"", name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    res.render('checkin', { customer : customer, bookinfo : bookinfo })
  },

  // // post 查找用户是否是会员
  // // checkin的ejs页面暂时没有用到“查找用户是否是会员”
  // checkInVIPSubmit: function(req, res, next) {
  //   return res.redirect('/searchcus')
  // },

  // post 非预定用户入住写入入住信息数据库(待完成)
  checkInWrite: function(req, res, next) {


function checkInBookSearch(req, res, next) {
  const CustomerId = req.fields.idcard

  // 校验参数
  try {
    if (CustomerId.length != 18) {
      throw new Error('无效身份证号')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.render('/checkin')
  }
  BookModel.getBookInfoById(CustomerId)
    .then(function (customer) {
      if (!customer) {
        var session = req.session;
        req.flash('error', '预定信息不存在')
        url = '/checkin?idcard='+id.toString()
        return res.render(url)
      }
      req.flash('success', '查询成功')
      res.render('checkin',{customer:customer,bookinfo:bookinfo})
    })
}

function checkInGetRoom(req, res, next) {
  const roomtype = req.fields.roomtype
  rooms = RoomModel.getRoomIdByType(roomtype).number
  checkin_info = '666'
  //$("#RoomNumber").val("rooms[0].toString()")
}

    const CustomerId = req.fields.idcard.toString()
    const name = req.fields.name.toString()
    const phone = req.fields.phone.toString()
    //const price = req.fields.price.toString()
    const RoomNumber = '222'
    const startdate = Number(req.fields.starttime.toString())
    const enddate = Number(req.fields.endtime.toString())
    const roomtype = req.fields.roomtype

    // 校验参数
    try {
      if (CustomerId.length != 18) {
        throw new Error('无效身份证号')
      }
      if (!name) {
        throw new Error('姓名不能为空')
      }
      if (phone.length != 11) {
        throw new Error('无效手机号')
      }
      if (roomtype!= "单人房"&&roomtype!= "双人房"&&roomtype!= "大房") {
        throw new Error('房间类型填写有误，正确格式为：单人房/双人房/大房') 
      }
      if (!startdate) {
        throw new Error('入住时间不能为空')
      }
      if (!enddate) {
        throw new Error('退房时间不能为空')
      }
      if (!RoomModel.getRoomByNumber(RoomNumber)) {
        throw new Error('无效房间号')
      }
      if (!RoomNumber) {
        throw new Error('请获取房间号')
      }
    } catch (e) {
      req.flash('error', e.message)
      url = '/checkin?idcard='+CustomerId.toString()+'&name='+name.toString()+'&phone='+phone.toString()
      +'&roomtype='+roomtype.toString()+'&startdate='+startdate.toString()+'&enddate='+enddate.toString()
      return res.redirect(url)
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
    EmptyRoomModel.reduceNumberBetweenDaysByType(startdate, enddate, roomtype)
    // 写入 flash
    req.flash('success', roomtype+'数量-1')

  }

}


