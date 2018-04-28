const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const RoomModel =require('../models/rooms.js')
const CheckInfoModel =require('../models/checkInfo.js')
const checkLogin = require('../middlewares/check').checkLogin


router.get('/', checkLogin, function (req, res, next) {
    res.render('checkout')
})

router.post('/', checkLogin, function (req, res, next) {
	const roomid= req.field.roomid

	CheckinfoModel.getCheckInfoByRoom(roomid)
	    .then(function (number) {
	      if (!number) {
	        req.flash('error', '房间号不存在')
	        return res.redirect('/checkout')
	      }
	      req.flash('success', '查询成功')

	      var checkinfo = { CustomerId :"", name: "", phone: "", startdate: "", enddate: ""};

	      //  还不确定25是否正确，照着沛东写的
	      req.field.name=  checkinfo.name
	      req.field.idcard= checkinfo.CustomerId
	      req.field.phone= checkinfo.phone
	      req.field.startdate= checkinfo.startdate
	      req.field.enddate= checkinfo.enddate

	      res.render('checkout',{number:number,bookinfo:bookinfo})
	    })
	    .catch(next)	

    CheckinfoModel.delCheckInByRoom(roomid)
    	.then(function (number) {
	      	req.flash('success', '删除成功记录')
	        return res.redirect('/manage')
	    })
	    .catch(next)
  })

module.exports = {
  checkoutPage: function(req, res) {
    res.render("checkout");
  }
}
