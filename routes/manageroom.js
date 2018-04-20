<<<<<<< HEAD
const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('manageroom')
})

router.post('/add', checkLogin, function (req, res, next) {
  const number = req.fields.roomnumber
  const type = req.fields.roomtype
  const value = req.fields.roomvalue
  let mapassword = req.fields.mapassword

  // 校验参数
  try {
    if (!number.length) {
      throw new Error('请填写房间号')
    }
    if (!type.length) {
      throw new Error('请填写房间类型')
    }
    if (!value.length) {
      throw new Error('请填写房间价格')
    }
    if (mapassword !== "forbidden") {
      throw new Error('管理员码错误')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/manageroom/add')
  }
  

  // 待写入数据库的房间信息
  let room = {
    number: number,
    type: type,
    value : value,
    status : "empty",
  }

  // 房间信息写入数据库
   RoomModel.create(room)
    .then(function (result) {
      req.flash('success', '添加成功')
      res.redirect('/manageroom')
    })
    .catch(function (e) {
      // 房间号被占用则跳回添加页
      if (e.message.match('duplicate key')) {
        req.flash('error', '房间号已被占用')
        return res.redirect('/manageroom')
      }
      next(e)
    }) 
})

router.post('/delete', checkLogin, function (req, res, next) {
  const number = req.fields.roomnumber
  const type = req.fields.roomtype
  const value = req.fields.roomvalue
  let mapassword = req.fields.mapassword

  // 校验参数
  try {
    if (!number.length) {
      throw new Error('请填写房间号')
    }
    if (!type.length) {
      throw new Error('请填写房间类型')
    }
    if (!value.length) {
      throw new Error('请填写房间价格')
    }
    if (mapassword !== "forbidden") {
      throw new Error('管理员码错误')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/manageroom')
  }
  
  let room = {
    number: number,
    type: type,
    value : value,
    status : "empty",
  }

  RoomModel.getRoomByNumber(room.number)
    .then(function (result) {
      if (!result) {
        req.flash('error', '房间号不存在')
        res.redirect('/manageroom')
      }
    })

   RoomModel.delRoomById(room.number)
    .then(function (result) {
      req.flash('success', '删除成功')
      res.redirect('/manageroom')
    })
    .catch(next) 
})

module.exports = router
=======
const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('manageroom')
})

module.exports = router
>>>>>>> 4b3767a783f70ff99a6437c515d4af7e2c001dcf
