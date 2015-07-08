/****/
var my_url = "https://takaogirl5566.com";
if(!chrome.cookies) {
	chrome.cookies = chrome.experimental.cookies;
}

var last_read = 0;
var table = {};
var tab_table = {};
var sync = false;

chrome.runtime.onMessage.addListener(function(req, sender, resp) {
	var ctl = req.ctl;
	if(ctl == 0) {
		var cur_name = get_name_from_tabs(sender.tab.id);
		resp({
			name: cur_name,
			inner: read_from_sandbox(cur_name),
			pos: last_read_pos(cur_name),
			sync: sync
		});
	}
	else if(ctl == 1) resp({isin: is_in_cookie(req.name), pos: last_read_pos(req.name)});
	else if(ctl == 3) save_read_pos(req.name, req.pos, sender.tab.id);
	else if(ctl == 4) set_last_read(req.name);
	else if(ctl == 5) write_to_sandbox(req.name, req.s);
	else sync_box_controller(req.sync);
});

chrome.cookies.getAll({"url": my_url}, function(cookies) {
	for(var i = 0; i < cookies.length; i++) {
		var c = cookies[i];
		if(c.name == "last_read") last_read = c.value;
		else table[c.name] = c.value;
	}
});
function get_name_from_tabs(tabid) {
	//TODO
}

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

function save_read_pos(name, pos, tabid) {
	alert("TODO!!!"+tabid);
	var c = {
		url: my_url,
		name: name,
		value: String(pos),
		expirationDate: new Date().getTime()*2
	};
	chrome.cookies.set(c, null);
	if(sync) {
		chrome.tabs.query({}, function(tabs){
			for(var i = 0; i < tabs.length; i++) {
				chrome.tabs.sendMessage(tabs[i].id, {"ctl": 0, "name": name, "pos": pos}, null); 
			}
		});
	}
	table[name] = pos;
}

function is_in_cookie(name) {
	if(table[name] == undefined) return false;
	else return true;
}
/****/
function sync_box_controller(if_sync) {
	sync = if_sync;
	chrome.tabs.query({}, function(tabs){
		for(var i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, {"ctl": 1, "sync": sync}, null); 
		}
	});
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