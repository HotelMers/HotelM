const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const CusModel = require('../models/customers')
const BookModel = require('../models/bookInfo')
const checkLogin = require('../middlewares/check').checkLogin

// 盘点结算
// 删除预订信息
// 更新剩余可用房源信息
module.exports = {

	balanceclearPage: function (req, res, next) {
    	res.render('balance')
	},

	balanceclearSubmit: function (req, res, next) {
		// 更新剩余空房数据库（日期-1）
  		var updateDate = EmptyRoomModel.update();

  		// 
		var array_of_id= new Array()

		const id = req.fields.idcard
		const starttime = req.fields.starttime
		const endtime = req.fields.endtime

		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var time_in_num= year*10000+month*100+day;

		for (var i = 0; i < BookModel.id_array.length; i++) {
			
			// array_of_id.push(BookModel.id_array[i])
			// 循环删除所有预订信息
			
			// 通过id使用getBookInfoById获得customer，再通过
			
			BookinfoModel.getBookInfoById(BookModel.id_array[i])
			    .then(function (id) {
			      //
			      	var bookinfo = { id :"", name: "", phone: "", type: "",startdate: "", enddate: ""};
				    if (bookinfo.endtime< time_in_num) {
						BookModel.deleteInfoByid(id)
							.then(function (id) {
								req.flash('success', '删除成功过期记录')
								req.flash('success',updateDate.year+'年'+updateDate.month+'月'+updateDate.day+'日'+',结算成功');
					        	return res.redirect('/manage')
							})
							.catch(function (e) {
						        // 没有过期记录
						        req.flash('error', '没有该项记录')
						        return res.redirect('/balance')
						        next(e)
						    })
						.catch(next)
					}	  	
			    })
			    	
		}
	}
}