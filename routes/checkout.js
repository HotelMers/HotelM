const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const RoomModel =require('../models/rooms.js')
const CheckInfoModel =require('../models/checkInfo.js')
const checkLogin = require('../middlewares/check').checkLogin



module.exports = {
  checkoutPage: function(req, res) {
    	res.render("checkout");
  },

	checkoutSubmit: function (req, res, next) {
		const number= req.fields.roomid
		const zero = 0
		RoomModel.getRoomByNumber(Number(number))
			.then(function (result) {
				if (result>100) {
					req.flash('success', '房间号存在')
					return res.redirect('/checkout')
				}
				if (result.length== 0) {
					req.flash('error', '房间号不存在')
					return res.redirect('/checkout')
				}
			})
		// CheckInfoModel.getCheckInfoByRoom(number)
		//     .then(function (number) {
		//       if (!number) {
		//         req.flash('error', '房间号不存在')
		//         return res.redirect('/checkout')
		//       }
		//       req.flash('success', '查询成功')

		//       var checkinfo = { CustomerId :"", name: "", phone: "", startdate: "", enddate: ""};

		//       //  还不确定25是否正确，照着沛东写的
		//       req.field.name=  checkinfo.name
		//       req.field.idcard= checkinfo.CustomerId
		//       req.field.phone= checkinfo.phone
		//       req.field.startdate= checkinfo.startdate
		//       req.field.enddate= checkinfo.enddate

		//       res.render('checkout',{number:number,bookinfo:bookinfo})
		//     })
		//     .catch(next)	

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
	}
}
