const express = require('express')
const router = express.Router()

const CusModel = require('../models/customers')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('balance');
})

router.post('/', checkLogin, function (req, res, next) {
  })

module.exports = {
  balancePage: function(req, res) {
    res.render("balance");
  }
}
