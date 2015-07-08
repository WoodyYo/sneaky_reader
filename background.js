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
var content = 'fuck!';
var filename = "takaogirl5566.txt";
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.requestFileSystem(window.TEMPORARY, 1024 * 1024 * 10, function(filesystem) {
    fs = filesystem;
    rootdir = fs.root;
    fs.root.getFile(filename, {}, function(fileEntry) {
    	fileEntry.file(function(file) {
    		var reader = new FileReader();
    		reader.onloadend = function(e) {
    			content = e.target.result;
    		};
    		reader.readAsText(file);
    	}, error_handle);
    }, error_handle);
}, error_handle);

function write_to_sandbox(name, s) {
	content = s;
	rootdir.getFile(filename, {create: false}, function(fileEntry) {
		fileEntry.remove(write_to_sandbox2, null);
	}, write_to_sandbox2);
}
function write_to_sandbox2() {
	rootdir.getFile(filename, {create: true}, function(fileEntry) {
		fileEntry.createWriter(function(fileWriter) {
			var b = new Blob([content]);
			fileWriter.write(b);
		}, error_handle);
	}, error_handle);
}

function read_from_sandbox(name) {
	return content;
}

function error_handle(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log(msg);
}