// include your file here
var signinRouter = require("./signin.js")
var manageRouter = require("./manage.js")
var signoutRouter = require("./signout.js")
var signupRouter = require("./signup.js")
var balanceRouter = require("./balance.js")
var bookroomRouter = require("./bookroom.js")
var checkoutRouter = require("./checkout.js")
var manageroomRouter = require("./manageroom.js")
var balanceClearRouter = require("./balanceclear.js")
var balanceRouter = require("./balance.js")
var searchcusRouter = require("./searchcus.js")
var checkinRouter = require("./checkin.js")
var financeRouter = require("./finance.js")
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
    app.get('/manageroom/resetroom', checkLogin, function(req, res) {
        manageroomRouter["resetroomPage"](req, res);
    })
    app.post('/manageroom/resetroom', checkLogin, function(req, res, next) {
        manageroomRouter["resetroomSubmit"](req, res);
    })

    // balance 盘点结算
    app.get('/balance', checkLogin, function(req, res) {
        balanceClearRouter["balanceclearPage"](req, res);
    })
    app.post('/balance', checkLogin, function(req, res, next) {
        balanceClearRouter["balanceclearSubmit"](req, res, next);
    })

    // searchcus 查询会员
    app.get('/searchcus', checkLogin, function(req, res) {
        searchcusRouter["searchvipPage"](req, res);
    }) 
    app.post('/searchcus', checkLogin, function(req, res, next) {
        searchcusRouter["searchvipSubmit"](req, res, next);
    }) 

    // checkin
    app.get('/checkin', checkLogin, function(req, res) {
        checkinRouter["checkInPage"](req, res);
    })
    app.post('/checkin', checkLogin, function(req, res, next) {
        checkinRouter["checkInSearchBookInfo"](req, res, next);
    })
    app.get('/checkin/getRoom', checkLogin, function(req, res) {
        checkinRouter["checkInWritePage"](req, res);
    })
    app.post('/checkin/getRoom', checkLogin, function(req, res, next) {
        checkinRouter["checkInWrite"](req, res, next);
    })


    app.get('/bookroom', checkLogin, function(req, res) {
        bookroomRouter["bookroomPage"](req, res);
    })
    app.post('/bookroom', checkLogin, function(req, res, next) {
        bookroomRouter["bookroomSubmit"](req, res,next);
    })
    app.get('/bookroom/getcustomer', checkLogin, function(req, res) {
        bookroomRouter["bookroomPageHascustomers"](req, res);
    })
    app.post('/bookroom/getcustomer', checkLogin, function(req, res, next) {
        bookroomRouter["bookroomSubmitHascustomers"](req, res,next);
    })

    app.get('/checkout', checkLogin, function(req, res) {
        checkoutRouter["searchroomidPage"](req, res);
    })
    app.post('/checkout', checkLogin, function(req, res, next) {
        checkoutRouter["searchroomidSubmit"](req, res,next);
    })
     app.get('/checkout/getcheck', checkLogin, function(req, res) {
        checkoutRouter["searchroomidPageHasinfo"](req, res);
    })
    app.post('/checkout/getcheck', checkLogin, function(req, res, next) {
        checkoutRouter["checkoutSubmitHasinfo"](req, res,next);
    })
    
    // 财务报表
    app.get('/finance', checkLogin, function(req, res) {
        financeRouter["financePage"](req, res);
    })
    app.post('/finance', checkLogin, function(req, res, next) {
        financeRouter["financeSubmit"](req, res, next);
    })
    // add more router
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).render('404')
      }
    })
}

