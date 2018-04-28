const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin

module.exports = {
  // get
  manageroomPage: function(req, res) {
    var result = RoomModel.getAllRoomInfo();
    if (!result) result = {number:'0',type:'0',value:'0',status:'0'}
    req.flash(result)
    res.render('manageroom', { result:result});
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
      if (!number.length) {
        throw new Error('请填写房间号')
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
      status : 0,
    }

    // 用户信息写入数据库
    RoomModel.create(room)
      .then(function (result) {
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

    // 从数据库中删除对应房间记录
    RoomModel.delRoomById(Number(number))
      .then(function (result) {
        if (result.deletedCount==1) {
          // 写入 flash
          req.flash('success', '删除成功')
          // 跳转到首页
          res.redirect('/manageroom')
        }
        // 无该房间则跳回添加页
        req.flash('error', '该房间不存在')
        return res.redirect('back')
      })
      .catch(function (e) {
        // 异常// 房间号被占用则跳回添加页
        req.flash('error', '删除失败')
        return res.redirect('back')
        req.flash('error', '删除失败')
        return res.redirect('back')
        next(e)
      })
  },
  // get /manageroom/addroomPage 修改房间
  updateroomPage: function(req, res) {
    res.render("updateroom");
  },

  // post /manageroom/addroomPage 修改房间
  updateroomSubmit: function (req, res, next) {
    RoomModel.getRoomByNumber(111)
      .then(function (result) {
        if (!result) {
          req.flash('error', '没有房间')
          res.redirect('/manageroom/updateroom')
        }
        req.flash(result.number)
        res.redirect('/manageroom/updateroom')
    })
    .catch(next) 
  }

}
