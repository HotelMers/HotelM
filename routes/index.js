// include your file here
var signinRouter = require("./signin.js")


module.exports = function(app) {
    app.get('/signin', function(req, res) {
        // add your function here
        signinRouter["signInFunction"](req, res);
    })
    app.get('/signout', function(req, res) {
    })
    app.get('/manage', function(req, res) {
    })
    app.get('/signup', function(req, res) {
    })
    app.get('/manageroom', function(req, res) {
    })
    app.get('/searchcus', function(req, res) {
    })
    app.get('/checkin', function(req, res) {
    })
    app.get('/bookroom', function(req, res) {
    })
    app.get('/checkout', function(req, res) {
    })
    app.get('/balance', function(req, res) {
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