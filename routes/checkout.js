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
    // req.flash('success',date1.year+'年'+date1.month+'月'+date1.day+'日'+',结算成功');
    return date1;
  }

module.exports = {
	searchroomidPage: function(req, res) {
		// var customer = {id:req.query.idcard, name:req.query.name, score: req.query.score,phone:req.query.phone}
    	var checkinfo = { CustomerId: req.query.idcard, name:req.query.name, phone:req.query.phone, 
      type:req.query.roomtype, startdate:req.query.startdate, enddate:req.query.enddate}
    	res.render("checkout",{ checkinfo : checkinfo});
    	
  	},
  	// 查询房间按钮
  	searchroomidSubmit: function(req, res, next) {
  		//
  		var checkinfo_temp
		const number= req.fields.roomid
  		// 通过房间号获取checkinfo的信息
    	CheckInfoModel.getCheckInfoByRoom(Number(number))
			.then(function (result) {
				if (!result) {
					// 暂时先这么设置，等区分好按钮即可完成
			        // checkinfo_temp = {CustomerId: "430502199901012222", name:"luomiao", phone:"13975962368",RoomNumber:"101",startdate:Number(20180512),enddate:Number(20180513)}
			    	result = {CustomerId: "", name:"", phone:"",RoomNumber:"",startdate:-1,enddate:-1}
			    }
			    checkinfo_temp= result
			    res.redirect(url)
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
		var zero= 0
	  	RoomModel.setStatusByRoomNumer(Number(number),zero)
			.then(function (result) {
				if (!result) {
					req.flash('error', '房间号不存在')
				} else {
					req.flash('success', '房间号存在')
				}
			})

	    CheckInfoModel.delCheckInByRoom(Number(number))
	    	.then(function (result) {
	    		// eq.flash('success', result.length)
	    		if (result.deletedCount>=1) {
						req.flash('success', '成功退房')

						// 退房同时增加对应日期的空房
						CheckInfoModel.getCheckInfoByRoom(Number(number))
							.then(function (result1) {

					   			var begindays= new Number(result1.startdate)
							    begindays= begindays% 100;
							    var finaldays= new Number(result1.enddate)
							    finaldays= finaldays% 100;
							    var month_temp= new Number(result1.startdate)
							    month_temp= (month_temp/ 100)%100;

							    for (var i = begindays; i < finaldays; i++) {
							      	emptyRoomNumber.addNumberByDateAndType(2018,Math.round(month_temp),i,roomtype);
							    }

							    return res.redirect('/manage')
							})
					}
			})
			.catch(function (e) {
		          // 修改剩余空房信息
		          req.flash('error', '删除失败')
		          return res.redirect('/manage')
		          next(e)
	        })
		//id是身份证信息,删除预定表的
		BookInfoModel.deleteInfoByid(Number(number))
	    	.then(function (result) {
	    		if (result.deletedCount>=1) {
			        // eq.flash('success', result.length)
			      	req.flash('success', '成功删除预订信息')
			        return res.redirect('/manage')
			        next(e)
				}
			})
			.catch(function (e) {
	time_in_num        // 修改剩余空房信息
			      req.flash('error', '删除失败')
			      return res.redirect('/manage')
			      next(e)
	    	})
		
	}
}