const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../index')
const User = require('../lib/mongo').User
const Room = require('../lib/mongo').Room

const testName1 = 'testName1'
const testName2 = 'sysuhotel'
const testNumber1 = 999
const testNumber2 = 998

describe('test', function () {
  describe('POST test', function () {
    const agent = request.agent(app)// persist cookie when redirect
    beforeEach(function (done) {
      // 创建一个房间
      Room.create({
        number: testNumber1,
        type: "单人房",
        status : '0',
      })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
        // 创建一个用户
      User.create({
        name: testName1,
        password: '123456',
      })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })

    afterEach(function (done) {
      // 删除测试房间
      Room.deleteMany({ number: { $in: [testNumber1, testNumber2] } })
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
        // 删除测试用户
      User.deleteMany({ name: { $in: [testName1, testName2] } })
      .exec()
      .then(function () {
        done()
      })
      .catch(done)
    })

    after(function (done) {
      process.exit()
    })

    // 用户名错误的情况
    it('wrong name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: '' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/名字请限制在 1-10 个字符/))
          done()
        })
    })

    // 密码格式错误的情况
    it('wrong password', function (done) {
        agent
          .post('/signup')
          .type('form')
          .field({ name: testName2, password:"haha" })
          .redirects()
          .end(function (err, res) {
            if (err) return done(err)
            assert(res.text.match(/密码至少 6 个字符/))
            done()
          })
      })

     // 两次输入密码不一致的情况
     it('password not equal', function (done) {
        agent
          .post('/signup')
          .type('form')
          .field({ name: testName2, password:"hahaaa", repassword:"yayaaa" })
          .redirects()
          .end(function (err, res) {
            if (err) return done(err)
            assert(res.text.match(/两次输入密码不一致/))
            done()
          })
      })

      // 管理员码不正确的情况
     it('wrong mapassword', function (done) {
        agent
          .post('/signup')
          .type('form')
          .field({ name: testName2, password:"hahaaa", repassword:"hahaaa", mapassword :"dsdsddsds" })
          .redirects()
          .end(function (err, res) {
            if (err) return done(err)
            assert(res.text.match(/管理员码错误/))
            done()
          })
      })
    
    // 用户名被占用的情况
    it('duplicate name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName1,  password: '123456', repassword:'123456', mapassword: 'forbidden'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用户名已被占用/))
          done()
        })
    })

    // 注册成功的情况
     it('success', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({ name: testName2,  password: '1234567', repassword:'1234567', mapassword: 'forbidden'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/注册成功/))
          done()
        })
      })

      // 用户名不存在的情况
    it('name not exists', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: testName2, password:'123456' })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用户不存在/))
          done()
        })
    })

    // 用户名为空的情况
    it('name blank', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: "" })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请填写用户名/))
          done()
        })
    })

    // 密码为空的情况
    it('password blank', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({ name: testName1, password:"" })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请填写密码/))
          done()
        })
    })

    // 密码错误的情况
    it('password wrong', function (done) {
        agent
          .post('/signin')
          .type('form')
          .field({ name: testName1, password:"hahaha" })
          .redirects('/manage')
          .end(function (err, res) {
            if (err) return done(err)
            assert(res.text.match(/用户名或密码错误/))
            done()
          })
      })

    // 登录成功的情况
    it('success', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({name: testName1,password: '123456',})
        .redirects('/manage')
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/登录成功/))
          done()
        })
      })

    // 房间号有误的情况
    it('roomnumber blank', function (done) {
      agent
        .post('/manageroom/addroom')
        .type('form')
        .field({ roomnumber: "" })
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请填写房间号:数字/))
          done()
        })
    })

     // 房间类型填写有误的情况
     it('roomtype error', function (done) {
      agent
        .post('/manageroom/addroom')
        .type('form')
        .field({ roomnumber: 998, roomtype:"single"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/房间类型填写有误，正确格式为/))
          done()
        })
    })

     // 管理员码错误的情况
     it('mapassword error', function (done) {
      agent
        .post('/manageroom/addroom')
        .type('form')
        .field({ roomnumber: 998, roomtype:"单人房",mapassword:"lllllll"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/管理员码错误/))
          done()
        })
    })

    // 房间号已被占用的情况
    it('roomnumber duplicate', function (done) {
      agent
        .post('/manageroom/addroom')
        .type('form')
        .field({ roomnumber: 999, roomtype:"单人房",mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/房间号已被占用/))
          done()
        })
    })

    // 房间号错误的情况
    it('roomnumber wrong', function (done) {
      agent
        .post('/manageroom/deleteroom')
        .type('form')
        .field({ roomnumber: ""})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/请填写房间号/))
          done()
        })
    })

    // 管理员码错误的情况
    it('mapassword wrong', function (done) {
      agent
        .post('/manageroom/deleteroom')
        .type('form')
        .field({ roomnumber: "999", mapassword:"dsdadsdsa"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/管理员码错误/))
          done()
        })
    })

    // 不存在房间的情况
    it('roomnumber not exist', function (done) {
      agent
        .post('/manageroom/deleteroom')
        .type('form')
        .field({ roomnumber: 998, mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/管理员码错误/))
          done()
        })
    })

    // 删除成功的情况
    it('success', function (done) {
      agent
        .post('/manageroom/deleteroom')
        .type('form')
        .field({ roomnumber: 999, mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/删除成功/))
          done()
        })
    })

    // 起始时间格式错误的情况
    it('st wrong', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "999", endtime:"20180712", roomtype:"单人房", roomvalue:"111", mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/起始时间格式错误/))
          done()
        })
    })

    // 结束时间格式错误的情况
    it('et wrong', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "20180712", endtime:"999", roomtype:"单人房", roomvalue:"111", mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/结束时间格式错误/))
          done()
        })
    })

    // 结束时间不能早于起始时间
    it('st et wrong', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "20200712", endtime:"20180711", roomtype:"单人房", roomvalue:"111", mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/结束时间不能早于起始时间/))
          done()
        })
    })

    // 起始时间不能早于今日
    it('st today wrong', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "20180512", endtime:"20200713", roomtype:"单人房", roomvalue:"111", mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/起始时间不能早于今日/))
          done()
        })
    })

    // 房间类型填写有误
    it('roomtype wrong', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "20200512", endtime:"20200713", roomtype:"单房", roomvalue:"111", mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/房间类型填写有误/))
          done()
        })
    })

    // 房间价格填写有误
    it('roomvalue wrong', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "20200512", endtime:"20200713", roomtype:"单人房", roomvalue:"xyz", mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/房间价格填写有误/))
          done()
        })
    })

    // 房间价格不能小于50
    it('roomvalue smaller than 50', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "20200512", endtime:"20200713", roomtype:"单人房", roomvalue:"20", mapassword:"forbidden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/房间价格不能小于50/))
          done()
        })
    })

    // 管理员码错误
    it('mapassword wrong', function (done) {
      agent
        .post('/manageroom/updateroom')
        .type('form')
        .field({ starttime: "20200512", endtime:"20200713", roomtype:"单人房", roomvalue:"210", mapassword:"forbidsdden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/管理员码错误/))
          done()
        })
    })

    // 管理员码错误
    it('mapassword wrong', function (done) {
      agent
        .post('/manageroom/resetroom')
        .type('form')
        .field({ mapassword:"forbidsdden"})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/管理员码错误/))
          done()
        })
    })
  })
})