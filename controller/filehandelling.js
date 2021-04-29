var express = require('express')
var mongoose = require('mongoose');
var path = require('path');
var Form = require('../model/db');
const fs = require('fs');
var bodyParser = require('body-parser')
var app = express()
const multer = require('multer');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const { body, validationResult } = require('express-validator');
const { isBuffer } = require('util');

module.exports = {
    get_index_homepage:(req,res)=>{
        res.render('index')
    },
    post_index:  (req, res) => {
        const errors = validationResult(req);
        console.log(errors)
    
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        var f = req.file
        if (!f)
            res.send('upload file pls!!!!')
        var n = {
            email:req.body.name_email,
            video:req.body.name_video,
            name: req.body.name_field,
            phone:req.body.name_phone,
            img: {

                data: fs.readFileSync(path.join(__dirname ,'../uploads/' + req.file.filename)),
                contentType: 'image/png',
                url:"../uploads/"+req.file.filename
            }
    
        }
        console.log("before saving")
        var d = new Form(n)
        console.log(d)
    
        d.save()
            .then(item => {
                res.send("sucess full");
            })
            .catch(err => {
    
                console.log(err);
                res.end('ERROR WHILE SENDING')
            });
    },

    getdata: (req, res) => {
        const page = req.query.page;
       var totalitem
          var itemsperpage = 5;
          Form.find().estimatedDocumentCount().then(numberofitems=>{
            totalitem = numberofitems
            Form.find({},function(err,result){
                        if(err) {
                           res.send(err);
                         } else {
                             res.render('submit', 
                             {
                                 "a":result,
    
                                "total_item" : Math.ceil(totalitem/3),
    
                                "nextpage" : parseInt(page)+1,
                                 "prevpage": page - 1,
                            })
                         }
                       })
                       .skip((page-1)*itemsperpage)
                       .limit(3);
        });  
    },

    postlogin:(req,res)=>{
       var  n = req.body
              console.log(n);
        res.send(n);
    },

    register_post:(req, res)=> {
        var username = req.body.username
        var password = req.body.password
        User.register(new User({ username: username }),
                password, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
      
            passport.authenticate("local")(
                req, res, function() {
                res.render("search");
            });
        });
    }
}