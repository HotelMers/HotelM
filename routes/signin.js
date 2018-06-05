const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

module.exports = {
  // GET /signin 用户登录
  signInPage: function (req, res) {
    res.render("signin");
  },

  // POST /signin 用户登录
  singInCheck: function(req, res) {
    const name = req.fields.name
    const password = req.fields.password
    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名')
      }
      if (!password.length) {
        throw new Error('请填写密码')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    UserModel.getUserByName(name)
      .then(function (user) {
        if (!user) {
          req.flash('error', '用户不存在')
          return res.redirect('back')
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误')
          return res.redirect('back')
        }
        req.flash('success', '登录成功')
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/manage')
      })
  },
  singInCheckPass: function(req, res) {
    const name = req.fields.name
    const password = req.fields.password
    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名')
      }
      if (!password.length) {
        throw new Error('请填写密码')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    UserModel.getUserByName(name)
      .then(function (user) {
        if (!user) {
          req.flash('error', '用户不存在')
          return res.redirect('back')
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误')
          return res.redirect('back')
        }
        req.flash('success', '登录成功')
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/manage')
      })
  },
    singInCheckAll: function(req, res) {
    const name = req.fields.name
    const password = req.fields.password
    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名')
      }
      if (!password.length) {
        throw new Error('请填写密码')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    UserModel.getUserByName(name)
      .then(function (user) {
        if (!user) {
          req.flash('error', '用户不存在')
          return res.redirect('back')
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误')
          return res.redirect('back')
        }
        req.flash('success', '登录成功')
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/manage')
      })
  }
}
