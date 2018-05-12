// checkInSearchById
const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin


module.exports = {
  // GET
  searchcusPage: function (req, res) {
    res.render('searchcus')
  },

  // POST
  searchcusSubmit: function(req, res, next) {
    const id = req.fields.idcard
  
    // 校验参数
    try {
      if (id.length != 18) {
        throw new Error('无效身份证号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/searchcus')
    }

    CusModel.getCusById(id)
      .then(function (customer) {
        if (!customer) {
          req.flash('error', '会员不存在')
          return res.redirect('/searchcus')
        }
        req.flash('success', '查询成功')

        var bookinfo = { id :"", name: "", score : "", phone: ""};

        res.render('checkin',{customer:customer,bookinfo:bookinfo})
      })
      
  }
}