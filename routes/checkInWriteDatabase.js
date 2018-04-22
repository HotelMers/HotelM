// checkInWriteDatabase

const express = require('express')
const router = express.Router()

const customerModel = require('../models/customers')
const checkLogin = require('../middlewares/check').checkLogin


module.exports = {
  checkInWrite: function(req, res) {
    const id = req.fields.id
    const name = req.fields.name
    const score = req.fields.score
    const phone = req.fields.phone

    // 待写入数据库的顾客信息
    let customer = {
      id : id,
      name: name,
      score : score,
      phone : phone,
    }

    // 顾客信息写入数据库
    RoomModel.create(customer)
      .then(function (result) {
        req.flash('success', '添加顾客成功')
        res.redirect('/checkin')
      })
      .catch(function (e) {
        // 顾客已存在，跳回checkIn
        if (e.message.match('duplicate key')) {
          req.flash('error', '顾客已存在')
          return res.redirect('/checkin')
        }
        next(e)
    }) 
  }

}