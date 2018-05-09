const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const CheckInfoModel = require('../models/checkInfo')

const checkLogin = require('../middlewares/check').checkLogin

module.exports = {
  // GET
  checkInPage: function (req, res) {
    var bookinfo = { id :"", name: "", score : "", phone: ""};
    var customer = {id:"", name:"", score:"", phone:""};
    res.render('checkin', { customer : customer, bookinfo : bookinfo })
  },

  // post 查找用户是否预订
  checkInBookSubmit: function(req, res, next) {
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

    BookModel.getBookInfoById(id)
      .then(function (customer) {
        if (!customer) {
          req.flash('error', '预定信息不存在')
          return res.redirect('/checkin')
        }
        req.flash('success', '查询成功')
        res.render('checkin',{customer:customer,bookinfo:bookinfo})
      })
      
  },

  // post 查找用户是否是会员
  checkInVIPSubmit: function(req, res, next) {
    return res.redirect('/searchcus')
  },

  // post 写入入住信息数据库
  checkInWrite: function(req, res, next) {
    const id = req.fields.id
    const name = req.fields.name
    const score = req.fields.score
    const phone = req.fields.phone

    // 校验参数
    try {
      if (id.length != 18) {
        throw new Error('无效身份证号')
      }
      if (phone.length != 11) {
        throw new Error('无效手机号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    // 待写入数据库的顾客信息
    let customer = {
      id : id,
      name: name,
      score : score,
      phone : phone,
    }

    // 顾客信息写入数据库
    CusModel.create(customer)
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

