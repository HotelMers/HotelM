// checkInSearchById
const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin


module.exports = {
  //GET 根据填写的信息，查找用户，返回用户信息
  searchvipPage: function(req, res) {
    res.render('searchcus');
  },
  //POST 根据填写的信息，查找用户，返回用户信息
  searchvipSubmit: function(req, res, next) {
    const idcardnum = req.fields.id

    //校验参数
    try {
      if (idcardnum.length != 18) {
        throw new Error('无效身份证号')
      }
    } catch (e) {
<<<<<<< HEAD
      req.flash('error', e.message)
      return res.redirect('/searchcus')
=======
      req.flash('error', '无效身份证号')
      return res.redirect('searchcus')
>>>>>>> master
    }
    
    CusModel.getCusById(idcardnum)
      .then(function (customer) {
        if (!customer) {
          req.flash('error', '会员不存在')
<<<<<<< HEAD
          return res.redirect('/searchcus')
=======
          return res.redirect('searchcus')
>>>>>>> master
        }
        req.flash('success', '查询成功')

        res.render('searchcus', {customer:customer})
      })

  },
}