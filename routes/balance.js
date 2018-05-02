const express = require('express')
const router = express.Router()

const EmptyRoomModel = require('../models/emptyRoomNumber')
const checkLogin = require('../middlewares/check').checkLogin


module.exports = {
  balancePage: function balancePage(req, res) {
    res.render("balance");
  },

  balanceSubmit: function balanceSubmit(req, res, next) {
  	// 更新剩余空房数据库（日期-1）
  	EmptyRoomModel.update();
  	
  	// 其他事情....
    // 

  	// 写入 flash
  	req.flash('success', '结算成功')
  	// 跳转到首页
  	res.redirect('/manage')
  },
}
