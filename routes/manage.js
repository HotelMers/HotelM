const express = require('express')
const router = express.Router()

module.exports = {
  managePage: function(req, res) {
    res.render("manage");
  }
}
