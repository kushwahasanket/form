var express = require('express')
var mongoose = require('mongoose');
var path = require('path');
var Form = require('./model/db');
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var fs = require('fs');
var url = require('url');
const { body, validationResult } = require('express-validator');

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/uploads', express.static(__dirname + '/uploads'));


const db = mongoose.connection;
mongoose.connect('mongodb://localhost/testform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.on('error', () => { console.log('error') });
db.once('open', function () {
    console.log('connected');
});
app.get('/', (req, res) => {
    res.render('index')
})
var multer = require('multer');
const { isBuffer } = require('util');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage });

app.post('/',body('name_email').isEmail(),
upload.single('myimage'), (req, res) => {

    var f = req.file
    if (!f)
        res.send('upload file pls!!!!')
   // console.log(req.file)
    var n = {
        email:req.body.nam_email,
        video:req.body.name_video,
        name: req.body.name_field,
        phone:req.body.name_phone,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png',
            url:"/uploads/"+req.file.filename

        }

    }
    console.log(n)
    //console.log(req.body.name_field)
    var d = new Form(n)
    d.save()
        .then(item => {

        })
        .catch(err => {
            console.log(err);
        });
    res.redirect('/')
})

app.get('/search', (req, res) => {
  
    Form.find().then(data => {
       
        //console.log(data)
       
        res.render('submit', {"a":data})
      
    })
})
app.get('/search/:searchedname',(req,res)=>{
    console.log(req.query)
Form.find({"name":req.query.name},(error,data)=>{
    // if(err)
    // {
    //     console.log(err)
    // }
    // else{
    //     //console.log(data);
    //     res.render('search',{"a":data})
    // }
    console.log(data)
    res.render('search',{a:data})
})
})

app.listen(3000, () => {
    console.log('server up')
})