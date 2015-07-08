/****/
var my_url = "https://takaogirl5566.com";
if(!chrome.cookies) {
	chrome.cookies = chrome.experimental.cookies;
}

var last_read = 0;
var table = {};

chrome.runtime.onMessage.addListener(function(req, sender, resp) {
	var ctl = req.ctl;
	if(ctl == 0) resp({name: last_read});
	else if(ctl == 1) resp({isin: is_in_cookie(req.name), pos: last_read_pos(req.name)});
	else if(ctl == 2) {
		resp({
			inner: read_from_sandbox(req.name), //from file
			pos: last_read_pos(req.name) //from cookie
		});
	}
	else if(ctl == 3) save_read_pos(req.name, req.pos);
	else if(ctl == 4) set_last_read(req.name);
	else write_to_sandbox(req.name, req.s)
});

chrome.cookies.getAll({"url": my_url}, function(cookies) {
	for(var i = 0; i < cookies.length; i++) {
		var c = cookies[i];
		if(c.name == "last_read") last_read = c.value;
		else table[c.name] = c.value;
	}
});

function set_last_read(name) {
	var c = {
		url: my_url,
		name: "last_read",
		value: name,
		expirationDate: new Date().getTime()*2 
	};
	chrome.cookies.set(c, null);

	last_read = name;
}

function last_read_pos(name) {
	return table[name];
}

function save_read_pos(name, pos) {
	var c = {
		url: my_url,
		name: name,
		value: String(pos),
		expirationDate: new Date().getTime()*2
	};
	chrome.cookies.set(c, null);
	
	chrome.tabs.query({}, function(tabs){
		for(var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, {"name": name, "pos": pos}, null); 
		}
	});

	table[name] = pos;
}

function is_in_cookie(name) {
	if(table[name] == undefined) return false;
	else return true;
}
/****/
var fs = null;
var rootdir;
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.requestFileSystem(window.PERSISTENT, 1024 * 1024 * 10, function(filesystem){
    fs = filesystem;
    rootdir = fs.root;
}, null);
 
var filename = "takaogirl5566.txt";
rootdir.getFile(filename, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(fileWriter) {
    	fileWriter.onwritten = function(e) {
    		getFileURL(filename, null);
    	}
    });
}, null);


function write_to_sandbox(name, s) {

}

function read_from_sandbox(name) {
	return "WHOLE BUNCH OF THINGS</br>";
}