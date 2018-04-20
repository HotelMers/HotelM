<<<<<<< HEAD
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
=======
module.exports = function (app) {
    app.get('/', function (req, res) {
      res.redirect('/signin')
    })
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/manage', require('./manage'))
    app.use('/signup', require('./signup'))
    app.use('/manageroom', require('./manageroom'))
    app.use('/searchcus', require('./searchcus'))
    app.use('/checkin', require('./checkin'))
    app.use('/bookroom', require('./bookroom'))
    app.use('/checkout', require('./checkout'))
    app.use('/balance', require('./balance'))
    app.use('/finance', require('./finance'))
    app.use('/addroom', require('./addroom'))
    app.use('/deleteroom', require('./deleteroom'))
    app.use('/changemoney', require('./changemoney'))
>>>>>>> 4b3767a783f70ff99a6437c515d4af7e2c001dcf
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).render('404')
      }
    })
}