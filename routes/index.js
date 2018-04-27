// include your file here
var signinRouter = require("./signin.js")
var manageRouter = require("./manage.js")
var signoutRouter = require("./signout.js")
var signupRouter = require("./signup.js")
var balanceRouter = require("./balance.js")
var bookroomRouter = require("./bookroom.js")
var checkoutRouter = require("./checkout.js")

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
    app.get('/manage', function(req, res, next) {
        manageRouter["managePage"](req, res, next);
    })
    app.get('/signup', function(req, res, next) {
        signupRouter["signupPage"](req, res, next);
    })
    app.post('/signup', function(req, res, next) {
        signupRouter["signupAndCreateUser"](req, res, next);
    })
    app.get('/manageroom', function(req, res) {
    })
    app.get('/searchcus', function(req, res) {
    })
    app.get('/checkin', function(req, res) {
    })
    app.get('/bookroom', function(req, res) {
        bookroomRouter["bookroomPage"](req, res);
    })
    app.get('/checkout', function(req, res) {
        checkoutRouter["checkoutPage"](req, res);
    })
    app.get('/balance', function(req, res) {
        balanceRouter["balancePage"](req, res);
    })
    app.get('/finance', function(req, res) {
    })
    // add more router
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).render('404')
      }
    })
}