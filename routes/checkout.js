const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const RoomModel =require('../models/rooms')
const CheckInfoModel =require('../models/checkInfo')
const BookInfoModel =require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin
const emptyRoomNumber = require('../models/emptyRoomNumber')

var toDate = function(stringDate) {
    var stringDate= Number(stringDate);

    // 初始化方法 new Date(yyyy,month,dd)
    // start_date
    var year= stringDate/ 10000;
    var month= (stringDate% 10000)/ 100;
    var day= (stringDate% 10000)% 100;
    var date1= new Date()
    date1.setFullYear(year,month,day)
    req.flash('success',date1.year+'年'+date1.month+'月'+date1.day+'日'+',结算成功');
    return date1;
  }

module.exports = {
	searchroomidPage: function(req, res) {
		var checkinfo_temp
		const number= req.fields.roomid
  		// 通过房间号获取checkinfo的信息
    	CheckInfoModel.getCheckInfoByRoom(Number(number))
			.then(function (result) {
				if (!result) {
			        checkinfo_temp = {CustomerId: "", name:"", phone:"",RoomNumber:"",startdate:"",enddate:""}
			    }
			    checkinfo_temp= result
			    res.render('checkout', {checkinfo:checkinfo_temp})
			})
    	
  	},
  	// 查询房间按钮
  	searchroomidSubmit: function(req, res, next) {
  		//
  	},

  	//退房按钮
	checkoutSubmit: function (req, res, next) {

		//number是房间号，暂时不知道是哪个属性值得到
		const number= req.fields.roomid
		var zero= 0
	  	RoomModel.setStatusByRoomNumer (Number(number),zero)
			.then(function (result) {
				if (number>100) {
					req.flash('success', '房间号存在1')
				} else {
					req.flash('error', '房间号不存在1')
				}
			})

	    CheckInfoModel.delCheckInByRoom(Number(number))
	    	.then(function (result) {
	    		// eq.flash('success', result.length)
			    req.flash('success', '成功退房')
			    var date= new Date()
	    		emptyRoomNumber.addNumberBetweenDaysByType(date,date,result.type)
			    return res.redirect('/manage')
			})
		//id是身份证信息,删除预定表的
		BookInfoModel.deleteInfoByid(Number(id))
	    	.then(function (result) {
	    		if (!result) {
	    			// 修改剩余空房信息
			        req.flash('error', '删除预订信息失败')
			        return res.redirect('/manage')			    
			    } else {
			        // eq.flash('success', result.length)
			      	req.flash('success', '成功删除预订信息')
			        return res.redirect('/manage')
			        next(e)
				}
			})
		//days是住的时间,startdate,enddate分别是起止时间，由于days类型目前很迷
	}
}
