const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const EmptyRoomModel = require('../models/emptyRoomNumber')
const checkLogin = require('../middlewares/check').checkLogin
const EmptyRoomNumber = require('../lib/mongo').EmptyRoomNumber

module.exports = {
  // get
  manageroomPage: function(req, res) {
    RoomModel.getAllRoomInfo()
    .then(function (rooms) {
      if (!rooms) {
        rooms = {number:'0',type:'0',value:'0',status:'0'}
      }
      // 简单处理信息
      for (var i = 0; i < rooms.length; i++) {
        (function (index) {
          if (rooms[index].status=='0')
            rooms[index].status="无人入住";
        })(i);
      }

      // test
      // var d = new Date();

      // hasEmptyRoomBetweenDaysByType()
      res.render('manageroom',{rooms:rooms})
    })
  },

  // get /manageroom/addroomPage 添加房间
  addroomPage: function(req, res) {
    res.render("addroom");
  },

  // post /manageroom/addroomPage 添加房间
  addroomSubmit: function(req, res, next) {
    const number = req.fields.roomnumber
    const type = req.fields.roomtype
    const value = req.fields.roomvalue
    let mapassword = req.fields.mapassword

    // 校验参数
    try {
      if (!number.length || isNaN(value)) {
        throw new Error('请填写房间号:数字')
      }
      if (!type.length || (type!= "单人房"&&type!= "双人房"&&type!= "大房")) {
        throw new Error('房间类型填写有误，正确格式为：单人房/双人房/大房')
      }
      if (!value.length || isNaN(value)) {
        throw new Error('房间价格填写有误')
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
      value : value,
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

  // get /manageroom/addroomPage 删除房间
  deleteroomPage: function(req, res) {
    res.render("deleteroom");
  },

  // post /manageroom/addroomPage 删除房间
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


    RoomModel.getRoomByNumber(Number(number)).then(function(room) {
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
  // get /manageroom/addroomPage 修改房间
  updateroomPage: function(req, res) {
    res.render("updateroom");
  },

  // post /manageroom/addroomPage 修改房间
  updateroomSubmit: function (req, res, next) {
    const type = req.fields.roomtype
    const value = req.fields.roomvalue
    let mapassword = req.fields.mapassword

    // 校验参数
    try {
      if (!type.length || (type!= "单人房"&&type!= "双人房"&&type!= "大房")) {
        throw new Error('房间类型填写有误，正确格式为：单人房/双人房/大房')
      }
      if (!value.length || isNaN(value)) {
        throw new Error('房间价格填写有误')
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
      type: type,
      value : value,
    }

    // 从数据库中修改对应房间记录
    RoomModel.updateRoomValue(room)
      .then(function (result) {
        if (result.modifiedCount>=1) {
          // 写入 flash
          req.flash('success', '修改成功')
          // 跳转到首页
          res.redirect('/manageroom')
        }
        // 无该房间则跳回添加页
        req.flash('error', '修改失败')
        return res.redirect('back')
      })
      .catch(function (e) {
        // 异常 跳回添加页
        req.flash('error', '修改失败')
        return res.redirect('back')
        next(e)
      })
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
