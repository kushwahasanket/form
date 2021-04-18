var express = require('express')
var multer = require('multer');
var path = require('path');
const fs = require('fs');
var getindex = require('../controller/filehandelling')
const { body, validationResult } = require('express-validator');
var router  = express.Router();
var storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage });
router.post('/index',upload.single('myimage'),body('name_email').isEmail(),getindex.post_index)

module.exports = router
