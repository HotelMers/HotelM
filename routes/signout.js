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
  },
  singoutCheck: function(req, res) {
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
  singoutCheckPass: function(req, res) {
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
    singoutCheckAll: function(req, res) {
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
    singoutCheckSome: function(req, res) {
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
  signoutCheck2: function(req, res) {
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
  signoutCheckPass2: function(req, res) {
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
    signoutCheckAll2: function(req, res) {
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
    signoutCheckSome2: function(req, res) {
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
