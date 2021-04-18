var express = require('express')
var getindex = require('./controller/filehandelling')
var app = express()
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var router = require('./routes/postdata') 
var mongoose = require('mongoose');
app.use('/uploads', express.static(__dirname + '/uploads'));
//app.use('/uploads', express.static(__dirname + 'controller'));
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
app.use(router)   
app.get('/search',getindex.getdata)

app.listen(3000, () => {
    console.log('server up')
    console.log(__dirname + "../controller/uploads")
})