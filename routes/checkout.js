const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const RoomModel =require('../models/rooms')
const CheckInfoModel =require('../models/checkInfo')
const BookInfoModel =require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin
const EmptyRoomModel = require('../models/emptyRoomNumber')
const DateHelper = require('../middlewares/dateHelper')

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
    	CheckInfoModel.getCheckInfoByRoomandstatus(Number(number), 1)
			.then(function (result) {
				if (!result) {
					req.flash('error', '房间号不存在')
					url = '/checkout?roomid='+number.toString()
					return res.redirect(url)
			    } else {
			    	if (result.isValid== 1) {
				    	 req.flash('success', result.isValid)
				    	url = '/checkout?idcard='+(result.CustomerId).toString()+'&roomid='+number.toString()+'&name='+(result.name).toString()+'&phone='+(result.phone).toString()
				        +'&roomtype='+(result.roomtype).toString()+'&startdate='+(result.startdate).toString()+'&enddate='+(result.enddate).toString()
				        +'&RoomNumber='+(result.RoomNumber).toString()
				        return res.redirect(url)
				    } else {
				    	// req.flash('error', result.isValid)
				    	req.flash('error', '房间号不存在')
						url = '/checkout?roomid='+number.toString()
						return res.redirect(url)
				    }
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
		const number= req.fields.roomid
		const startdate= req.fields.starttime
		const enddate= req.fields.endtime
		const roomtype= req.fields.roomtype.toString()
		var zero= 0

	  	RoomModel.setStatusByRoomNumer(Number(number),zero.toString())
		.then(function (result) {
	        if (result.modifiedCount>=1) {
	          // 写入 flash
	          req.flash('success', '修改房间状态成功')
	        } else {
	        	// 无该房间则跳回添加页
	          req.flash('error', '修改失败')
	        }
	        
	    })
	    .catch(function (e) {
	        // 异常 跳回添加页
	        req.flash('error', e.message)
	        next(e)
	    })
	    .then(function(){
	    		// req.flash('success', Number(number))
			CheckInfoModel.setvalidByRoomNumer(Number(number),Number(startdate),Number(enddate))
				.then(function (result) {
					req.flash('success', '房号:'+Number(number))
					if (!result) {
						req.flash('error', 'fail')
				    } else {
				    	req.flash('success', '入住信息状态改变成功')
			    	}
				})
				.catch(function (e) {
					req.flash('error', 'fail')
				})
				.then(function(){
					//id是身份证信息,删除预定表的
					const id = req.fields.idcard
					BookInfoModel.deleteInfoByid(id)
			    	.then(function (result) {
			    		if (result.deletedCount>=1) {
					        // eq.flash('success', result.length)
					      	req.flash('success', '预订信息成功删除')
					        return res.redirect('/manage')
					        next(e)
						} else {
							req.flash('error', '预订信息删除失败')
						}
					})
					.catch(function (e) {
				     // 修改剩余空房信息
					      req.flash('error', '删除失败')
					      return res.redirect('/manage')
					      next(e)
			    	})
				})
				.then(function(){
					EmptyRoomModel.addNumberBetweenDaysByType(DateHelper.toDate(startdate), DateHelper.toDate(enddate), roomtype.toString())
		            req.flash('success', '对应'+roomtype+'数量+1')
					req.flash('success', '删除成功')
					return res.redirect('/manage')
				})
				
	    })
	}
}