const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin


// 删除预订信息
router.get('/', checkLogin, function (req, res, next) {
    res.render('balanceclear')
})

router.post('/', checkLogin, function (req, res, next) {
		const id = req.fields.idcard
		// 循环删除所有预订信息
	  BookModel.deleteInfoByid(id)
	  	.then(function (id) {
	  		// 删除逻辑尚待确定
	  	})
  })

module.exports = router