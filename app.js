var express = require('express')
var getindex = require('./controller/filehandelling')
var app = express()
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');

const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const passport = require('passport');
app.use(express.json());
var User = require('./model/User')
app.use(express.urlencoded({
  extended: true
}));
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var form = require('./routes/postdata') 
var auth = require('./routes/auth')
var mongoose = require('mongoose');
const session = require('express-session');
require('./config/passport')(passport);
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());

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
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register')
})


app.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (errr, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch(er => console.log(er));
            });
          });
        }
      });
    }
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/search',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });

app.get('/index',getindex.get_index_homepage)
app.use(form)   

app.get('/search',ensureAuthenticated,getindex.getdata)
app.use(auth)
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });




app.listen(3000, () => {
    console.log('server up')
    console.log(__dirname + "../controller/uploads")
})