const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()
const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

module.exports =  {

  signupPage: function (req, res, next) {
    res.render("signup");
  },

  // POST /signup 用户注册
  signupAndCreateUser : function(req, res, next) {
    const name = req.fields.name
    let password = req.fields.password
    const repassword = req.fields.repassword
    let mapassword = req.fields.mapassword

    // 校验参数
    try {
      if (!(name.length >= 1 && name.length <= 10)) {
        throw new Error('名字请限制在 1-10 个字符')
      }
      if (password.length < 6) {
        throw new Error('密码至少 6 个字符')
      }
      if (password !== repassword) {
        throw new Error('两次输入密码不一致')
      }
      if (mapassword !== "forbidden") {
        throw new Error('管理员码错误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/signup')
    }

    // 明文密码加密
    password = sha1(password)

    // 待写入数据库的用户信息
    let user = {
      name: name,
      password: password,
    }
    // 用户信息写入数据库
    UserModel.create(user)
      .then(function (result) {
        // 此 user 是插入 mongodb 后的值，包含 _id
        user = result.ops[0]
        // 删除密码这种敏感信息，将用户信息存入 session
        delete user.password
        req.session.user = user
        // 写入 flash
        req.flash('success', '注册成功')
        // 跳转到首页
        res.redirect('/manage')
      })
      .catch(function (e) {
        // 用户名被占用则跳回注册页，而不是错误页
        if (e.message.match('duplicate key')) {
          req.flash('error', '用户名已被占用')
          return res.redirect('/signup')
        }
        next(e)
      })
  },
  signupCheck: function(req, res) {
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
  signupCheckPass: function(req, res) {
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
    signupCheckAll: function(req, res) {
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
    signupCheckSome: function(req, res) {
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
  signupCheckPass2: function(req, res) {
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
    signupCheckAll2: function(req, res) {
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
    signupCheckSome2: function(req, res) {
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
