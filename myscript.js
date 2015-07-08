document.body.innerHTML += "<div id='novel_block'><div id='true_content'></div><button id='go_button'>GO</button><input id='novel_url' type='file'></input></div>";

var __div = document.getElementById("novel_block");
var __content = document.getElementById("true_content");
var __name;
var old_scrollTop;

chrome.runtime.sendMessage({"ctl": 0}, function(resp) {
	__name = resp.name; //search from cookie
	if(__name != "0") set_content(__name);
});

/****/
__div.onmouseover = function() {
	this.style.marginRight = "0";
	__content.style.visibility = "visible";
};
__div.onmouseout = function() {
	this.style.marginRight = "-245px";
	__content.style.visibility = "hidden";
};
/****/
var __file = document.getElementById("novel_url");
__file.onchange = function() {
	__name = __file.files[0].name;
	chrome.runtime.sendMessage({"ctl": 1, "name": __name}, function(resp) {
		if(resp.isin) set_content(__name);
		else { //first read
			chrome.runtime.sendMessage({"ctl": 4, "name": __name}, null);
			var reader = new FileReader();
			reader.onload = function(evt) {
				__content.innerHTML = do_escape(evt.target.result);
				chrome.runtime.sendMessage({"ctl": 5, "name": __name, "s": __content.innerHTML}, null);
			};
			reader.readAsText(__file.files[0]);
		}
		old_scrollTop = __content.scrollTop;
	});
};
document.getElementById("go_button").onclick = function() {
	__file.click();
};
/****/
function set_content(name) {
	chrome.runtime.sendMessage({"ctl": 2, "name": __name}, function(resp) {
		__content.innerHTML = resp.inner;
		__content.scrollTop = resp.pos;
	});
}
/****/
var __sent = false;
function save2cookie_timer() {
	if(old_scrollTop != __content.scrollTop) {
		old_scrollTop = __content.scrollTop;
		chrome.runtime.sendMessage({"ctl": 3, "pos": __content.scrollTop, "name": __name}, null);
		__sent = true;
	}
	setTimeout(save2cookie_timer, 3000);
}
save2cookie_timer();

chrome.runtime.onMessage.addListener(function(req, sender, resp) {
	if(req.name == __name && !__sent) __content.scrollTop = req.pos;
	__sent = false;
});
/****/
function do_escape(s) {
	return "<p>"+s.replace(/\n/g,"</p><p>")+"</p>";
}
/****/
