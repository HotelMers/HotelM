const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('addcus')
})

router.post('/', checkLogin, function (req, res, next) {
    const name = req.fields.name
    const id = req.fields.id
    const gender = req.fields.gender
  
    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写姓名')
      }
      if (!id.length) {
        throw new Error('请填写身份证号')
      }
      if (!gender.length) {
        throw new Error('请填写性别')
      }
      if (id.length != 18) {
        throw new Error('请输入正确的身份证号')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/addcus')
    }
  
    // 待写入数据库的客户信息
    let customer = {
      id: id,
      name : name,
      gender : gender,
      expenditure : 0,
      type: "normal",
    }
    // 客户信息写入数据库
    CusModel.create(customer)
      .then(function (result) {
        req.flash('success', '添加成功!会员名：', customer.name, '身份证号：', customer.id)
        res.redirect('/addcus')
      })
      .catch(function (e) {
        // 身份证号被占用则跳回添加页
        if (e.message.match('duplicate key')) {
          req.flash('error', '身份证号已被占用')
          return res.redirect('/addcus')
        }
        next(e)
      })
  })

module.exports = router