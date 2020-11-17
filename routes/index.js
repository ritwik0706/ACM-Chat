const User = require('../models/User');
const express = require('express');


const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
//router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
/*router.get('/dashboard', ensureAuthenticated, function(req, res){
	
  res.render('dashboard', {
    user: req.user
  })
});*/

//module.exports = router;

module.exports = function (app, io) {

	/*io.sockets.on("connection", function(socket){
		User.find({}, function(err, docs){
			if(err) throw err
			else socket.emit("user_list", docs)
				console.log("Emitted")
		})
	})*/
    
	app.get('/public_chat',ensureAuthenticated, function(req,res){
		User.find({}, function(err, docs){
			if (err) throw err
			console.log(docs)
			res.render('public_chat', {
				user : req.user,
				user_list : docs
			})
		})
	})

	app.get('/', forwardAuthenticated, (req, res) => res.render('welcome'))

};