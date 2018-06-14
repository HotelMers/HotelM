const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')
const checkLogin = require('../middlewares/check').checkLogin
const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber
const DateHelper = require('../middlewares/dateHelper')
const bi = require('../models/bookInfo')
const ci = require('../models/checkInfo')

module.exports = {
  // get
  manageroomPage: function(req, res) {
    RoomModel.getAllRoomInfo()
    .then(function (rooms) {
      if (!rooms) {
        rooms = {number:'0',type:'0',status:0}
      }
      // 简单处理信息
      for (var i = 0; i < rooms.length; i++) {
        (function (index) {
          if (rooms[index].status==0)
            rooms[index].status="无人入住";
        })(i);
      }

      // test
      // var d = new Date();
      // var p = bi.test()
      // p.then(function(re) {
      //   // alert(re);
      //   req.flash('success',re)
      // }).then(function(){
      //   res.render('manageroom',{rooms:rooms})
      // })
      // bi.getIndex('111111111111111111').then(function(re) {
      //   // alert(re);
      //   req.flash('success',re)
      // }).then(function(){
      //   res.render('manageroom',{rooms:rooms})
      // })

      res.render('manageroom',{rooms:rooms})
    })
  },

  // get /manageroom/addroomPage 添加房间
  addroomPage: function(req, res,next) {
    res.render("addroom");
  },

  // post /manageroom/addroomPage 添加房间
  addroomSubmit: function(req, res, next) {
    const number = req.fields.roomnumber
    const type = req.fields.roomtype
    let mapassword = req.fields.mapassword

    // 校验参数
    try {
      if (!number.length || isNaN(number)) {
        throw new Error('请填写房间号:数字')
      }
      if (number.length != 3) {
        throw new Error('请填写3位数房间号')
      }
      if (!type.length || (type!= "单人房"&&type!= "双人房"&&type!= "大房")) {
        throw new Error('房间类型填写有误，正确格式为：单人房/双人房/大房')
      }
      if (mapassword !== "forbidden") {
        throw new Error('管理员码错误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }
    
    // 待写入数据库的房间信息
    let room = {
      number: Number(number),
      type: type,
      status : '0',
    }

    // 用户信息写入数据库
    RoomModel.create(room)
      .then(function (result) {
        // 修改剩余空房数
        EmptyRoomModel.addNumberByType(type);        
        // 写入 flash
        req.flash('success', '添加成功')
        // 跳转到首页
        res.redirect('/manageroom')
      })
      .catch(function (e) {
        // 房间号被占用则跳回添加页
        if (e.message.match('duplicate key')) {
          req.flash('error', '房间号已被占用')
          return res.redirect('back')
        }
        next(e)
      })
  },

  // get /manageroom/deleteroomPage 删除房间
  deleteroomPage: function(req, res) {
    res.render("deleteroom");
  },

  // post /manageroom/deleteroomPage 删除房间
  deleteroomSubmit: function(req, res, next) {
    const number = req.fields.roomnumber
    let mapassword = req.fields.mapassword

    // 校验参数
    try {
      if (!number.length) {
        throw new Error('请填写房间号')
      }
      if (mapassword !== "forbidden") {
        throw new Error('管理员码错误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }


    // 空房数据库对应房间类型数量-1
    RoomModel.getRoomByNumber(Number(number)).then(function(room) {
      if (!room) {
        req.flash('error', '不存在房间')
        return res.redirect('back')
      }
      type = room.type;
      // 从数据库中删除对应房间记录
      RoomModel.delRoomById(Number(number))
        .then(function (result) {
          if (result.deletedCount>=1) {
            // 修改剩余空房信息
            EmptyRoomModel.reduceNumberByType(type);
            // 写入 flash
            req.flash('success', '删除成功')
            // 跳转到首页
            res.redirect('/manageroom')
          } 
          // 写入 flash
          req.flash('error', '删除失败')
          res.redirect('back')
        })
        .catch(function (e) {
          // 修改剩余空房信息
          req.flash('error', '删除失败')
          return res.redirect('back')
          next(e)
        })
    })
  },
  // get /manageroom/updateroomPage 修改房间
  updateroomPage: function(req, res) {
    res.render("updateroom");
  },

  // post /manageroom/updateroomPage 修改房间
  updateroomSubmit: function (req, res, next) {
    const startdate = req.fields.starttime.toString()
    const enddate = req.fields.endtime.toString()
    const type = req.fields.roomtype
    const price = req.fields.roomvalue.toString()
    let mapassword = req.fields.mapassword

    // 校验参数
    // 获取当前日期时间，用于和入住日期进行比较
    var myDate = new Date()
    var year = myDate.getFullYear().toString()    //获取完整的年份(4位)
    var month = (myDate.getMonth()+1).toString()       //获取当前月份(0-11,0代表1月)
    if (month.length == 1) month = '0'+month
    var day = myDate.getDate().toString()        //获取当前日(1-31)
    if (day.length == 1) day = '0'+day
    var today = year+month+day

    // 校验参数
    try {
      // 时间参数
      if (startdate.length != 8) {
        throw new Error('起始时间格式错误！正确格式为：（8位阿拉伯数字表示）YYYYMMDD')
      }
      if (enddate.length != 8) {
        throw new Error('结束时间格式错误！正确格式为：（8位阿拉伯数字表示）YYYYMMDD')
      }
      if (Number(startdate)-Number(enddate) > 0) {
        throw new Error('结束时间不能早于起始时间!')
      }
      if (Number(today)-Number(startdate) > 0) {
        throw new Error('起始时间不能早于今日!')
      }

      // 其他参数
      if (!type.length || (type!= "单人房"&&type!= "双人房"&&type!= "大房")) {
        throw new Error('房间类型填写有误，正确格式为：单人房/双人房/大房')
      }
      if (!price.length || isNaN(price)) {
        throw new Error('房间价格填写有误')
      }
      if (price < 50) {
        throw new Error('房间价格不能小于50')
      }
      if (mapassword !== "forbidden") {
        throw new Error('管理员码错误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    var isSuc = EmptyRoomModel.updatePriceBetweenDaysByType(DateHelper.toDate(startdate),DateHelper.toDate(enddate),type,Number(price))
    if (!isSuc && isSuc == false) {
      // 异常 跳回添加页
      req.flash('error', '修改失败:超出30天限制')
      return res.redirect('back')
    } else {
      // 写入 flash
      req.flash('success', '修改成功')
      // 跳转到首页
      res.redirect('/manage')
    }

    // // 待写入数据库的房间信息
    // let room = {
    //   type: type,
    //   value : value,
    // }

    // // 从数据库中修改对应房间记录
    // RoomModel.updateRoomValue(room)
    //   .then(function (result) {
    //     if (result.modifiedCount>=1) {
    //       // 写入 flash
    //       req.flash('success', '修改成功')
    //       // 跳转到首页
    //       res.redirect('/manageroom')
    //     }
    //     // 无该房间则跳回添加页
    //     req.flash('error', '修改失败')
    //     return res.redirect('back')
    //   })
    //   .catch(function (e) {
    //     // 异常 跳回添加页
    //     req.flash('error', '修改失败')
    //     return res.redirect('back')
    //     next(e)
    //   })
  },

  // get /manageroom/addroomPage 修改房间
  resetroomPage: function(req, res) {
    res.render("resetroom");
  },

  // post /manageroom/addroomPage 修改房间
  resetroomSubmit: function (req, res, next) {
    let mapassword = req.fields.mapassword

    // 校验参数
    try {
      if (mapassword !== "forbidden") {
        throw new Error('管理员码错误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    // 从数据库中修改对应房间记录
    RoomModel.deleteAll();
    req.flash('success', '重置成功')
    res.redirect('/manageroom')
  },

}
