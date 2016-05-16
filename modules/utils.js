//Utilities functions

module.exports.parseCookies = function(rawCookies) {
	var cookies = {};
	rawCookies.split(';').forEach(function(element) {
		var pair = element.split('=');
		cookies[pair[0].trim()] = pair[1].trim();
	});
	return cookies;
};

module.exports.generateID = function() {
	var id = "";
	var dataRange = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i = 0; i < 16; i++ )
		id += dataRange.charAt(Math.floor(Math.random() * dataRange.length));
	return id;
}