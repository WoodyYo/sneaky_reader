/****/
var my_url = "https://www.google.com";
if(!chrome.cookies) {
	chrome.cookies = chrome.experimental.cookies;
}

chrome.runtime.onMessage.addListener(function(req, sender, resp) {
	var ctl = req.ctl;
	if(ctl == 0) resp({name: last_read});
	else if(ctl == 1) resp({isin: is_in_cookie(req.name)});
	else if(ctl == 2) {
		resp({
			inner: read_from_sendbox(req.name), //from file
			pos: last_read_pos(req.name) //from cookie
		});
	}
	else if(ctl == 3) save_read_pos(req.pos);
	else if(ctl == 4) set_last_read(req.name);
	else write_to_sendbox(req.name, req.s)
});

var last_read;
chrome.cookies.get({"url": my_url, "name": "last_read"}, function(c) {
	if(c == undefined) last_read = 0;
	else last_read = c.value;
});

function set_last_read(name) {
	var c = {
		url: my_url,
		name: "last_read",
		value: name//,
		//expirationDate: new Date().getTime()*2 
	};
	alert(name+"123456");
	last_read = name;
	chrome.cookies.set(c, null);
}

function last_read_pos() {
	return 300;
}

function save_read_pos() {

}

function is_in_cookie(name) {
	return false;
}
/****/
function write_to_sendbox(name, s) {

}

function read_from_sendbox(name) {
	return "WHOLE BUNCH OF THINGS</br>";
}