const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const BookModel = require('../models/bookInfo')


  
module.exports = {
  bookroomPage: function(req, res) {
    res.render("bookroom");
  },
  bookroomSubmit: function (req, res, next) {
    const id = req.fields.idcard
    const name = req.fields.name
    // const score = req.fields.score
    const phone = req.fields.phone
    const roomtype = req.fields.roomtype
    const startdate = req.fields.startdate
    const enddate = req.fields.enddate


    // 校验参数
    try {
      if (!type.length) {
        throw new Error('请选择房间类型')
      }
      if (mapassword !== "forbidden") {
        throw new Error('管理员码错误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/bookroom')
    }

      // 待写入数据库的房间信息
      let bookinfo = {
        id: id,
        name: name,
        phone: phone,
        type: type,
        startdate: startdate,
        enddate: enddate
      }
    
      // 用户信息写入数据库
       BookModel.create(bookinfo)
        .then(function (result) {
          req.flash('success', '添加成功')
          res.redirect('/manageroom')
        })
        .catch(function (e) {
          // 预定失败
          req.flash('error', '预定失败')
          return res.redirect('/manageroom')
          next(e)
        }) 
  }
}
