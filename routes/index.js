// include your file here
var signinRouter = require("./signin.js")
var manageRouter = require("./manage.js")
var signoutRouter = require("./signout.js")
var signupRouter = require("./signup.js")
var balanceRouter = require("./balance.js")
var bookroomRouter = require("./bookroom.js")
var checkoutRouter = require("./checkout.js")
var manageroomRouter = require("./manageroom.js")
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
    app.get('/manage', checkLogin, function(req, res, next) {
        manageRouter["managePage"](req, res, next);
    })
    app.get('/signup', function(req, res, next) {
        signupRouter["signupPage"](req, res, next);
    })
    app.post('/signup', function(req, res, next) {
        signupRouter["signupAndCreateUser"](req, res, next);
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

    app.get('/searchcus', checkLogin, function(req, res) {
    })
    app.get('/checkin', checkLogin, function(req, res) {
    })
    app.get('/bookroom', checkLogin, function(req, res) {
        bookroomRouter["bookroomPage"](req, res);
    })
    app.get('/checkout', checkLogin, function(req, res) {
        checkoutRouter["checkoutPage"](req, res);
    })
    app.get('/balance', checkLogin, function(req, res) {
        balanceRouter["balancePage"](req, res);
    })
    app.get('/finance', checkLogin, function(req, res) {
    })
    // add more router
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).render('404')
      }
    })
}