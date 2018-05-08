const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const CheckInfoModel = require('../models/checkInfo')
const checkLogin = require('../middlewares/check').checkLogin


// 删除预订信息

module.exports = {

	balanceclearPage: function (req, res, next) {
    	res.render('balanceclear')
	},

	balanceclearSubmit: function (req, res, next) {
		// 只计算当日收入额，清除预定记录在checkout里面实现
		// 直接调用checkinfo里面函数就好
	}
}