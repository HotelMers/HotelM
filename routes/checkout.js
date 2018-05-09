const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const RoomModel =require('../models/rooms')
const CheckInfoModel =require('../models/checkInfo')
const BookInfoModel =require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin
const emptyRoomNumber = require('../models/emptyRoomNumber')


module.exports = {
	searchroomidPage: function(req, res) {
    	res.render("checkout");
  	},
  	searchroomidSubmit: function(req, res, next) {
  		const number= req.fields.roomid
  		// 通过房间号获取checkinfo的信息
    	CheckInfoModel.getCheckInfoByRoom(Number(number))
			.then(function (result) {
				if (result>100) {
					req.flash('success', '房间号存在')
					return res.redirect('/checkout', {checkinfo:checkinfo})
				}
				if (result.length== 0) {
					req.flash('error', '房间号不存在')
					return res.redirect('/checkout')
				}
			})
  	},

  	checkoutPage: function(req, res) {
    	res.render("checkout");
  	},
	checkoutSubmit: function (req, res, next) {

		//number是房间号，暂时不知道是哪个属性值得到
	  	RoomModel.setStatusByRoomNumer (Number(number),zero)
			.then(function (result, zero) {
				if (result>100) {
					req.flash('success', '房间号存在1')
				} else {
					req.flash('error', '房间号不存在1')
				}
			})

	    CheckInfoModel.delCheckInByRoom(Number(number))
	    	.then(function (result) {
	    		if (result.length== 3) {
	    			// eq.flash('success', result.length)
			      	req.flash('success', '成功退房')
			        return res.redirect('/manage')
			    } else {
			    	// 修改剩余空房信息
			          req.flash('error', '退房失败')
			          return res.redirect('back')
			          next(e)
				}
			})
		//id是身份证信息,删除预定表的
		BookInfoModel.deleteInfoByid(Number(id))
	    	.then(function (result) {
	    		if (result.length== 18) {
	    			// eq.flash('success', result.length)
			      	req.flash('success', '成功删除预订信息')
			        return res.redirect('/manage')
			    } else {
			    	// 修改剩余空房信息
			          req.flash('error', '删除预订信息失败')
			          return res.redirect('/manage')
			          next(e)
				}
			})
		//days是住的时间,startdate,enddate分别是起止时间，由于days类型目前很迷
		//先把逻辑写在这。。。还不能运行，但逻辑没有问题了
		for (var i = startdate; i < enddate; i++) {
			emptyRoomNumber.addNumberByDaysAndType(i,roomtype)
	            .then(function (days, type) {
	              req.flash('success', '操作成功')
	            })
	            .catch(function (e) {
	               req.flash('error', '操作失败')
	            })
		}
	}
}
