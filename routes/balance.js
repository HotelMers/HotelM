const express = require('express')
const router = express.Router()

const EmptyRoomModel = require('../models/emptyRoomNumber')
const checkLogin = require('../middlewares/check').checkLogin


// 生成财务报表
module.exports = {
  balancePage: function balancePage(req, res) {
    res.render("finance");
  },

  balanceSubmit: function balanceSubmit(req, res, next) {
    
    res.redirect("finance");
  },
}