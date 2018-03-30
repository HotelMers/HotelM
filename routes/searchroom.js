const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin


router.get('/', checkLogin, function (req, res, next) {
    res.render('searchroom')
})

router.post('/', checkLogin, function (req, res, next) {
    const number = req.fields.roomnumber
  
    // 校验参数
    try {
      if (!number.length) {
        throw new Error('请填写房间号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/searchroom')
    }

    RoomModel.getRoomByNumber(number)
      .then(function (room) {
        if (!room) {
          req.flash('error', '房间不存在')
          return res.redirect('/searchroom')
        }
        req.flash('success', '查询成功! 房间号: ', room.number,' 房间类型: ', room.type)
        res.redirect('/searchroom')
      })
      .catch(next)
  }) 

module.exports = router
