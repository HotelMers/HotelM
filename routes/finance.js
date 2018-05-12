const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin
const CheckInfoModel = require('../models/checkInfo')

//router.get('/', checkLogin, function (req, res, next) {
//    res.render('finance')
//})

//router.post('/', checkLogin, function (req, res, next) {
//  })

module.exports = {

	//get 生成财务报表
	financePage: function (req, res) {
		res.render("finance");
	},

	//post 生成财务报表
	financeSubmit: function(req, res, next) {
		const starttime = req.fields.starttime
		const endtime = req.fields.endtime
		let id = req.fields.id

		//校验参数
		try {
			if (!starttime.length || isNaN(starttime)) {
				throw new Error('请填写开始时间')
			}
			if (!endtime.length || isNaN(endtime)) {
				throw new Error('请填写结束时间')
			}
			if (id !== "forbidden") {
				throw new Error('管理员码错误')
			}
		} catch (e) {
			req.flash('error', e.massage)
			return res.redirect('back')
		}

		//用时间域获取入住信息

	}
}