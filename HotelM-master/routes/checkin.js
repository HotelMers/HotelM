const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    var bookinfo = { id :"", name: "", score : "", phone: ""};
    var customer = {id:"",name:"",score:"",phone:""};
    res.render('checkin',{customer:customer,bookinfo:bookinfo})
})

router.post('/searchCusById', checkLogin, function (req, res, next) {
  const id = req.fields.idcard
  
  // 校验参数
  try {
    if (!id.length) {
      throw new Error('请填写身份证号')
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
      BookModel.getBookInfoById(id)
        .then(function (bookif) {
          if (bookif) {
            bookinfo = bookif
          }
        })
        .catch(next)

      res.render('checkin',{customer:customer,bookinfo:bookinfo})
    })
    .catch(next)
      
  })

router.post('/getRoom', checkLogin, function (req, res, next) {  // 未完成
  const id = req.fields.idcard
  
  // 校验参数
  try {
    if (!id.length) {
      throw new Error('请填写身份证号')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/checkin')
  }
   return res.redirect('/checkin')   
  })


module.exports = router
