var express = require('express')
var mongoose = require('mongoose');
var Login = require('../model/login');


var fh = require('../controller/filehandelling')


var router = express.Router();

router.get('/login',(req, res)=>{

res.render("login")
})
router.post('/login',fh.postlogin)

module.exports = router;