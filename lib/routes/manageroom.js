const express = require('express')
const router = express.Router()

const RoomModel = require('../models/rooms')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function (req, res, next) {
    res.render('manageroom')
})

router.post('/', checkLogin, function (req, res, next) {
  })

module.exports = router