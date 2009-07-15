// helpers
function show_div(data, div_id) {
	var div = $(div_id); 
	div.html(data.message);
	div.animate({height: "30px"}, 300);
	setTimeout(function(){ div.animate({height: "0px"}, 300, function(){ div.html(""); div.hide()})}, 1400);
}

function refresh_page(location) {
	get_page(location, {
		success: function(data) {
			console.log("Get data");
			$(document.body).html(data)
		}
	})
}

// AJAX
var aliceUrl = "http://localhost:9999";

function get_page(url, opts) {
	_ajax_method("GET", url, opts);
};

function post(url, opts) {
	_ajax_method("POST", url, opts);
};

function post_delete(url, opts) {
	_ajax_method("DELETE", url, opts);
};

function _ajax_method(meth, url, opts) {
	$.ajax({
		url: aliceUrl + url,
		type: meth,
		cache: false,
		data: opts.data,
		dataType: "json",
		success: opts.success,
		error: opts.error
	 });
	return false;
};

function are_you_sure(msg, callback) {
	if (confirm(msg)) {
		callback()
	} else {
	}
}

function traverse(key, jsonObj, func) {
    if( typeof jsonObj == "object" ){
	    $.each(jsonObj, function(k,v) {
          traverse(k,v, func);
			})
		} else {
			func(key,jsonObj);
    }
};

function listify(obj, func) {
	var outList = "<ul>";
	$(obj).each(function(i, ele){
		var o = func(ele);
		if (o != null) {
			outList += "<li>"+o+"</li>";
		};		
	});
	outList += "</ul>";
	return outList;
};