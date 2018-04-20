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

      res.render('checkin',{customer:customer,bookinfo:bookinfo})
    })
    .catch(next)
      
  })

router.post('/getRoom', checkLogin, function (req, res, next) {  // 未完成
  const id = req.fields.idcard
  const name = req.fields.name
  const phone = req.fields.phone
  const roomtype = req.fields.roomtype
  const starttime = req.fields.starttime
  const endtime = req.fields.endtime
  
  // 校验身份证id
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
      if (customer.name != name) {
        req.flash('error', '姓名不一致')
        return res.redirect('/checkin')
      }
      if (customer.phone != phone) {
        req.flash('error', '电话不一致')
        return res.redirect('/checkin')
      }
      res.render('checkin',{customer:customer,bookinfo:bookinfo})
    })
    .catch(next)

  // 校验房间类型/入住&退房时间
  try {
    if (!roomtype.length) {  // 以下只保证非空，还应检查值的有效性
      throw new Error('请填写身份证号')
    }
    if (!starttime.length) {
      throw new Error('请填写入住时间')
    }
    if (!endtime.length) {
      throw new Error('请填写退房时间')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/checkin')
  }

  // 根据房间类型查找合适的房间 得到房间号

  // 显示房间号，并给出两个选择：确定入住or换房间

  // 如果确定入住，要改Room.status，CheckInfo要增加一条，当天剩余空房数量也要对应-1


   return res.redirect('/checkin')   
  })


module.exports = router
