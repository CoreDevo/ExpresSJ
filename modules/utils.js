/**
 * Created by JyaouShingan on 2016-05-10.
 */

module.exports.parseCookies = function(rawCookies) {
	var cookies = {};
	rawCookies.split(';').forEach(function(element) {
		var pair = element.split('=');
		cookies[pair[0].trim()] = pair[1].trim();
	});
	return cookies;
};