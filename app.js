var express = require('express')
var getindex = require('./controller/filehandelling')
var app = express()
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var form = require('./routes/postdata') 
var auth = require('./routes/auth')
var mongoose = require('mongoose');
app.use('/uploads',express.static('uploads'))
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
    res.render('home')
})

app.get('/index',getindex.get_index_homepage)
app.use(form)   
app.get('/search',getindex.getdata)
app.use(auth)


app.listen(3000, () => {
    console.log('server up')
    console.log(__dirname + "../controller/uploads")
})