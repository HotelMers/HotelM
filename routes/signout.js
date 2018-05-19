const express = require('express')
const router = express.Router()

module.exports = {
  // GET /signout 登出
  signoutPage: function (req, res, next) {
    // 清空 session 中用户信息
    req.session.user = null
    req.flash('success', '登出成功')
    // 登出成功后跳转到主页
    res.redirect('/signin')
  }
}
