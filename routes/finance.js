const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const RoomModel = require('../models/rooms')
const CheckInfoModel = require('../models/checkInfo')
const checkLogin = require('../middlewares/check').checkLogin

//router.get('/', checkLogin, function (req, res, next) {
//    res.render('finance')
//})

//router.post('/', checkLogin, function (req, res, next) {
//  })

module.exports = {

	//GET 生成财务报表
	financePage: function(req, res) {
		//CheckInfoModel.getAllCheckInfo()
		//.then(function(CheckInfo) {
		//	if (!CheckInfo) {
		//		CheckInfo = {CustomerId:'0',name:'0',phone:'0',RoomNumber:'0',startdate:'0',enddate:'0',roomtype:'0',payment:'0'}
		//	}
		//	res.render('finance', {CheckInfo:CheckInfo}) //, flag:flag
		//})
		var flag = false
		res.render('finance',{flag:flag}); //,{flag:flag}
	},

	//POST 生成财务报表
	financeSubmit: function(req, res, next) {
		const startdate = Number(req.fields.starttime)
		const enddate = Number(req.fields.endtime)
		let id = req.fields.id

		//校验参数
		try {
			if (!startdate || isNaN(startdate)) {
				throw new Error('请填写开始时间')
			}
			if (startdate < 20000000 || startdate > 29999999) {
				throw new Error('开始时间格式错误，正确格式为20XXXXXX')
			}
			if (!enddate || isNaN(enddate)) {
				throw new Error('请填写结束时间')
			}
			if (enddate < 20000000 || enddate > 29999999) {
				throw new Error('结束时间格式错误，正确格式为20XXXXXX')
			}
			if (id !== "forbidden") {
				throw new Error('管理员码错误')
			}
		} catch (e) {
			req.flash('error', e.message) //e.massage
			return res.redirect('/finance')
			//next(e)
		}

		CheckInfoModel.getCheckInfoByTimeRange(startdate, enddate) //, endtime
			.then(function(CheckInfo) {
				if (!CheckInfo) {
					req.flash('error', '信息不存在')
					return res.redirect('finance')
				}
				//req.flash('success', '成功')
				//console.log(CheckInfo);
				flag = true
				//, flag:flag
				res.render('finance.ejs', {CheckInfo:CheckInfo, flag:flag})//{RoomNumber:result.RoomNumber, Roomtype:result.Roomtype, starttime:result.startdate, endtime:result.enddate}
			})

	},
}
