// include your file here
var signinRouter = require("./signin.js")
var manageRouter = require("./manage.js")
var signoutRouter = require("./signout.js")
var signupRouter = require("./signup.js")
var balanceRouter = require("./balance.js")
var bookroomRouter = require("./bookroom.js")
var checkoutRouter = require("./checkout.js")
var manageroomRouter = require("./manageroom.js")
var balanceRouter = require("./balance.js")
var balanceClearRouter = require("./balanceclear.js")
var searchcusRouter = require("./searchcus.js")
var checkinRouter = require("./checkin.js")
const checkLogin = require('../middlewares/check').checkLogin

module.exports = function(app) {
    app.get('/signin', function(req, res, next) {
        signinRouter["signInPage"](req, res, next);
    })
    app.post('/signin', function(req, res, next) {
        signinRouter["singInCheck"](req, res, next);
    })
    app.get('/signout', function(req, res, next) {
        signoutRouter["signoutPage"](req, res, next);
    })
    app.get('/signup', function(req, res, next) {
        signupRouter["signupPage"](req, res, next);
    })
    app.post('/signup', function(req, res, next) {
        signupRouter["signupAndCreateUser"](req, res, next);
    })

    // manage
    app.get('/manage', checkLogin, function(req, res) {
        manageRouter["managePage"](req, res);
    })
    app.post('/manage', checkLogin, function(req, res) {
        manageRouter["clear"](req, res);
    })

    // manage room
    app.get('/manageroom', checkLogin, function(req, res) {
        manageroomRouter["manageroomPage"](req, res);
    })
    app.get('/manageroom/addroom', checkLogin, function(req, res) {
        manageroomRouter["addroomPage"](req, res);
    })
    app.post('/manageroom/addroom', checkLogin, function(req, res, next) {
        manageroomRouter["addroomSubmit"](req, res);
    })
    app.get('/manageroom/deleteroom', checkLogin, function(req, res) {
        manageroomRouter["deleteroomPage"](req, res);
    })
    app.post('/manageroom/deleteroom', checkLogin, function(req, res, next) {
        manageroomRouter["deleteroomSubmit"](req, res);
    })
    app.get('/manageroom/updateroom', checkLogin, function(req, res) {
        manageroomRouter["updateroomPage"](req, res);
    })
    app.post('/manageroom/updateroom', checkLogin, function(req, res, next) {
        manageroomRouter["updateroomSubmit"](req, res);
    })

    // finance 财务报表
    app.get('/finance', checkLogin, function(req, res) {
        balanceRouter["balancePage"](req, res);
    })
    app.post('/finance', checkLogin, function(req, res, next) {
        balanceRouter["balanceSubmit"](req, res, next);
    })

    // balance clear 盘点结算
    app.get('/balance', checkLogin, function(req, res) {
        balanceClearRouter["balanceclearPage"](req, res);
    })
    app.post('/balance', checkLogin, function(req, res, next) {
        balanceClearRouter["balanceclearSubmit"](req, res, next);
    })

    // checkInSearchById
    app.get('/searchcus', checkLogin, function(req, res) {
        searchcusRouter["searchcusPage"](req, res);
    })
    app.post('/searchcus', checkLogin, function(req, res, next) {
        searchcusRouter["searchcusSubmit"](req, res, next);
    })

    // checkin
    app.get('/checkin', checkLogin, function(req, res) {
        checkinRouter["checkInPage"](req, res);
    })
    app.post('/checkin', checkLogin, function(req, res, next) {
        checkinRouter["checkInSubmit"](req, res, next);
    })
    app.post('/checkin', checkLogin, function(req, res, next) {
        checkinRouter["checkInWrite"](req, res, next);
    })


    app.get('/bookroom', checkLogin, function(req, res) {
        bookroomRouter["bookroomPage"](req, res);
    })
    app.post('/bookroom', checkLogin, function(req, res, next) {
        bookroomRouter["bookroomSubmit"](req, res,next);
    })

    app.get('/checkout', checkLogin, function(req, res) {
        checkoutRouter["checkoutPage"](req, res);
    })
    app.post('/checkout', checkLogin, function(req, res, next) {
        checkoutRouter["checkoutSubmit"](req, res,next);
    })
    
    
    // add more router
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).render('404')
      }
    })
}