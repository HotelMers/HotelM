const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('searchcus')
})

router.post('/', checkLogin, function (req, res, next) {
    const id = req.fields.id
  
    // 校验参数
    try {
      if (!id.length) {
        throw new Error('请填写身份证号')
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
        res.redirect('/searchcus')
      })
      .catch(next)
  })

module.exports = router