var express = require('express')
var mongoose = require('mongoose');
var path = require('path');
var Form = require('./model/db');
var bodyParser = require('body-parser')
var app = express()
var {submit_form_data} = require('./form data/form_data')
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

//use ismail() after the upload because it will not able to handle multipart data
app.post('/',upload.single('myimage'),body('name_email').isEmail(), (req, res) => {
    
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
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png',
            url:"/uploads/"+req.file.filename

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
        
     
})

app.get('/search', (req, res) => {
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
 
});



app.get('/search/:searchedname',(req,res)=>{
    console.log(req.query)
Form.find({"name":req.query.name},(error,data)=>{
    
    console.log(data)
    res.render('search',{a:data})
})
})

app.listen(3000, () => {
    console.log('server up')
})