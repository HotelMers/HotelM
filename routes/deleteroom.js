const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('deleteroom')
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
    if (mapassword !== "forbidden") {
      throw new Error('管理员码错误')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/deleteroom')
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