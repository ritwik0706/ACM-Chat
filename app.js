const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, './views'), { maxAge: 86400000 }));

// Passport Config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser : true})
    .then(() => console.log('MongoDb connected...'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended : false }))

// Express session
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

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//server setup
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);

// Routes
//app.use('/', require('./routes/index'))
var index = require('./routes/index')(app, io);
app.use('/users', require('./routes/users'))
app.use('/public_chat',require('./routes/public_chat'))

//////////////////////////////////////////
//////////////////////////////////////////
//for public chat
connections=[];
users=[];
//for public chat

io.sockets.on('connection',function(socket){
  connections.push(socket);
  console.log('connected %s sockets connected',connections.length);

  //disconnect
  socket.on('disconnect',function(data) {
    // body...
    users.splice(users.indexOf(socket.username),1);
    updateUserNames();
    connections.splice(connections.splice(connections.indexOf(socket),1));
    console.log('Disconnected %s sockets connected',connections.length);
  });

  //send message
  socket.on('send message',function(data){
    console.log(data);
    io.sockets.emit('new message',data);
  });

  socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(socket.username);
    updateUserNames();
  })

  function updateUserNames(){
    io.sockets.emit('get users',users);
  }
  
});

const PORT = process.env.PORT || 5000

server.listen(PORT, console.log('Server connected on port '+ PORT))