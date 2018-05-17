// checkInSearchById
const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin


module.exports = {
  //GET 根据填写的信息，查找用户，返回用户信息
  searchvipPage: function(req, res) {
    var customer = {id:req.query.id, name:req.query.name, score:req.query.score, phone:req.query.phone}
    res.render('searchcus', {customer:customer});
  },
  //POST 根据填写的信息，查找用户，返回用户信息
  searchvipSubmit: function(req, res, next) {
    const id = req.fields.idcard

    //校验参数
    try {
      if (id.length != 18) {
        throw new Error('无效身份证号')
      }
    } catch (e) {
      req.flash('error', '无效身份证号')
      return res.redirect('searchcus')
    }
    
    CusModel.getCusById(id)
      .then(function (customer) {
        if (!customer) {
          req.flash('error', '会员不存在')
          url = '/searchcus?idcard='+id.toString()
          return res.redirect(url)
        } else {
          url = '/searchcus?idcard'+id.toString()+'&id='+(customer.id).toString()+'&name='+(customer.name).toString()+'&score='+(customer.score).toString()+'&phone='+(customer.phone).toString()
          req.flash('success', '会员存在')
          return res.redirect(url)
        }
        //req.flash('success', '查询成功')
        //res.redirect('searchcus')
        //res.render('searchcus.ejs', {id:customer.id, name:customer.name, phone:customer.phone, score:customer.score})
        //es.render('searchcus.ejs', {customer:customer})
      })

  },
}
