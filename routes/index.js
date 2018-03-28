module.exports = function (app) {
    app.get('/', function (req, res) {
      res.redirect('/signin')
    })
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/manage', require('./manage'))
    app.use('/signup', require('./signup'))
    app.use('/searchroom', require('./searchroom'))
    app.use('/addroom', require('./addroom'))
}