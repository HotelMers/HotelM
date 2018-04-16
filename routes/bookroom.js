const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('bookroom')
})

router.post('/', checkLogin, function (req, res, next) {
    const number = req.fields.roomnumber
    const type = req.fields.roomtype
    let mapassword = req.fields.mapassword
  
    // 校验参数
    try {
      if (!number.length) {
        throw new Error('请填写房间号')
      }
      if (!type.length) {
        throw new Error('请填写房间类型')
      }
      if (mapassword !== "forbidden") {
        throw new Error('管理员码错误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/addroom')
    }
  
    // 待写入数据库的房间信息
    let room = {
      number: number,
      type: type,
    }
    // 房间信息写入数据库
    RoomModel.create(room)
      .then(function (result) {
        req.flash('success', '添加成功')
        res.redirect('/addroom')
      })
      .catch(function (e) {
        // 房间号被占用则跳回添加页
        if (e.message.match('duplicate key')) {
          req.flash('error', '房间号已被占用')
          return res.redirect('/addroom')
        }
        next(e)
      })
  })

module.exports = router