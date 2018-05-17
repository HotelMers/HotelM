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
		// var customer = {id:req.query.idcard, name:req.query.name, score: req.query.score,phone:req.query.phone}
    	var checkinfo = { roomid: req.query.roomid, CustomerId: req.query.idcard, name:req.query.name, phone:req.query.phone, 
      roomtype:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    	res.render("checkout",{ checkinfo : checkinfo});
    	
  	},
  	// 查询房间按钮
  	searchroomidSubmit: function(req, res, next) {
  		//
  		// var checkinfo_temp
		const number= req.fields.roomid.toString()
  		// 通过房间号获取checkinfo的信息
    	CheckInfoModel.getCheckInfoByRoom(Number(number))
			.then(function (result) {
				if (!result) {
					req.flash('error', '房间号不存在')
					url = '/checkout?roomid='+number.toString()
					return res.redirect(url)
			    } else {
			    	url = '/checkout?idcard='+(result.CustomerId).toString()+'&roomid='+number.toString()+'&name='+(result.name).toString()+'&phone='+(result.phone).toString()
			        +'&roomtype='+(result.roomtype).toString()+'&startdate='+(result.startdate).toString()+'&enddate='+(result.enddate).toString()
			        +'&RoomNumber='+(result.RoomNumber).toString()
			        return res.redirect(url)
		    	}
			})
			
  	},
  	//get 
  	searchroomidPageHasinfo: function(req, res) {

		var checkinfo = { CustomerId: req.query.idcard, name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    	res.render("checkout",{ checkinfo : checkinfo});
    	
  	},
  	//post,退房按钮
	checkoutSubmitHasinfo: function (req, res, next) {

		//number是房间号，暂时不知道是哪个属性值得到
		const number= req.fields.roomid.toString()
		var zero= 0
	  	RoomModel.setStatusByRoomNumer(Number(number),zero.toString())
			.then(function (result) {
				if (!result) {
					req.flash('error', '房间号不存在')
				} else {
					req.flash('success', '房间状态改变成功')
				}
			})
		CheckInfoModel.setStatusByRoomNumer(Number(number))
			.then(function (result) {
				if (!result) {
					req.flash('error', 'fail')
			    } else {
			    	req.flash('success', '房间状态改变成功')
		    	}
			})

	  //   CheckInfoModel.delCheckInByRoom(number)
	  //   	.then(function (result) {
	  //   		// eq.flash('success', result.length)
	  //   		if (result.deletedCount>=1) {
			// 			req.flash('success', '成功退房')

			// 			// 退房同时增加对应日期的空房
			// 			CheckInfoModel.getCheckInfoByRoom(number)
			// 				.then(function (result1) {

			// 		   			var begindays= new Number(result1.startdate)
			// 				    begindays= begindays% 100;
			// 				    var finaldays= new Number(result1.enddate)
			// 				    finaldays= finaldays% 100;
			// 				    var month_temp= new Number(result1.startdate)
			// 				    month_temp= (month_temp/ 100)%100;

			// 				    for (var i = begindays; i < finaldays; i++) {
			// 				      	emptyRoomNumber.addNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
			// 				    }

			// 				})
			// 	}
			// 	req.flash('error', '失败退房')
			// })
			// .catch(function (e) {
		 //          // 修改剩余空房信息
		 //          req.flash('error', '删除失败')
		 //          return res.redirect('/manage')
		 //          next(e)
	  //       })
		//id是身份证信息,删除预定表的
		const id = req.fields.idcard
		BookInfoModel.deleteInfoByid(id)
	    	.then(function (result) {
	    		if (result.deletedCount>=1) {
			        // eq.flash('success', result.length)
			      	req.flash('success', '成功删除')
			        return res.redirect('/manage')
			        next(e)
				}
				req.flash('error', '失败退房')
			})
			.catch(function (e) {
		     // 修改剩余空房信息
			      req.flash('error', '删除失败')
			      return res.redirect('/manage')
			      next(e)
	    	})
		req.flash('success', '删除成功')
		return res.redirect('/manage')

	}
}