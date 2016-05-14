var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	// if (req.cookies.user == null) {
	//   //no cookie stored, proceed to login page
	//   res.redirect('/login');
	// } else {
	//   //direct cached user to chat room
	//   res.redirect('/chat');
	// }
	res.redirect('/login');
});

module.exports = router;