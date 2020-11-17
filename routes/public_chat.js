var express= require('express');
var router=express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
users=[];
connections=[];

router.get('/',ensureAuthenticated,function(req,res){
	res.render('public_chat',{user:req.user});
});

io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('connected %s sockets', connections.length);
});

module.exports=router;