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
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).render('404')
      }
    })
}