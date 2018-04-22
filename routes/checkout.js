const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkInfomodel = require('../models/checkinfo')
const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin
//  确认办理退房
router.get('/', checkLogin, function (req, res, next) {
    res.render('checkout')
})

router.post('/', checkLogin, function (req, res, next) {
    const number = req.fields.roomnumber
    const type = req.fields.roomtype

    
	// 判断是否有入住记录
	checkInfomodel.getCheckInfoByRoom(number)
      .then(function (number) {
      	//
      })
      .catch(function (e) {
        // 没有入住记录
        req.flash('error', '房间号未入住')
        return res.redirect('/deleteroom')
        next(e)
      })
	
	// 通过房间号删除数据
	checkInfomodel.delCheckInByRoom(number)
      .then(function (number) {
        req.flash('success', '删除成功')
        res.redirect('/manageroom')
      })
      .catch(function (e) {
        // 房间号不存在
        req.flash('error', '房间号不存在')
        return res.redirect('/deleteroom')
        next(e)
      })
  })

module.exports = router