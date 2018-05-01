const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin

module.exports = {
  // GET
  checkInPage: function (req, res) {
    var bookinfo = { id :"", name: "", score : "", phone: ""};
    var customer = {id:"", name:"", score:"", phone:""};
    res.render('checkin', { customer : customer, bookinfo : bookinfo })
  },

  // post 查找用户是否预订以及是否是会员
  checkInSearchByIdSubmit: function(req, res) {
    const id = req.fields.idcard
  
    // 校验参数
    try {
      if (id.length != 18) {
        throw new Error('无效身份证号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/checkin')
    }

    CusModel.getCusById(id)
      .then(function (customer) {
        if (!customer) {
          req.flash('error', '会员不存在')
          return res.redirect('/checkin')
        }
        req.flash('success', '查询成功')

        var bookinfo = { id :"", name: "", score : "", phone: ""};

        res.render('checkin',{customer:customer,bookinfo:bookinfo})
      })
      
  },

  // post 写入入住信息数据库
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