$(function(){
	
	var state = {
		currentForm : "<form></form>",
		currentBinding : []
	};
	
  state = originalBindings(state);
	var aliceUrl = "http://localhost:9999";
	
	function url_load_into(url, opts) {
		$.ajax({
		  url: aliceUrl + url,
		  cache: false,
		  dataType: "json",
		  success: function(data) {
				var jobj = {
					data: data,
					out: "",
					domEle: document.createElement('div'),
					after: function() {}
				};
				jobj = opts.success(jobj);
				$(jobj.domEle).prepend(jobj.out);
				$("#content").html($(jobj.domEle));
				
				console.log("Calling after for %o", $(jobj));
				$(jobj.after());
				
				state = originalBindings(state);
			},
			error: opts.error
			});
	};
	
	function post_data_to(data, url, opts) {
		$.post(aliceUrl + url, data, opts.success, "json");
		state = originalBindings(state);
	};
 
	var updateStatusFunc = function() {
		url_load_into("/control/status", {
			success: function(jobj) {			
				var status = $(jobj.data.status)[0];								
				jobj.out = "<h3>Applications</h3>";
				jobj.out += listify(status.applications, function(item){return item;});
				
				jobj.out += "<h3>Running nodes</h3>";
				jobj.out += listify(status.running_nodes, function(item){return item;});
				
				jobj.out += "<h3>All nodes</h3>";
				jobj.out += listify(status.nodes, function(item){return item;});				
				
				return jobj;
			}
		});
	};
	
	$("#node_status_link").click(updateStatusFunc);
	updateStatusFunc();
	
	var updateVhostFunc = function() {
		url_load_into("/vhosts", {
			success: function(jobj) {			
				var vhosts = $(jobj.data.vhosts);
				
				var newBinding = function() {
					var currentForm = '<form method="post" name="new_vhost_form" action="#" onSubmit="">';
					currentForm += "<fieldset>";     

					currentForm += "<label for='vhost'>Vhost</label>";
					currentForm += "<input type='text' id='vhost_name' name='vhost' class='text-input'></input>";

					currentForm += '<input type="submit" value="Submit" class="submit"/>'
					currentForm += '<span class="error" style="display:none"> Please Enter Valid Data</span>';
					currentForm += '<span class="success" style="display:none"> Registration Successfully</span></div>';
					currentForm += "</fieldset>";
					currentForm += "</form>";
					
					$(".hidden").append(currentForm);
					
					$(".add").click(function() {
						$(".hidden").show();
						jQuery.facebox($(".hidden"));
					});
					
					$("")
					console.log("hi %o", $(".submit"));
					$(".submit").click(function() {
						var vhost = $("#vhost_name").val();
						var dataString = {"name":vhost};
						
						console.log("dataString %o", dataString);
						post_data_to(dataString, "/vhosts", {
						success: function(data) {
							alert("success!!!");
						}
						});
						return false;
					});
					
				};
				
				state.currentBinding.push(newBinding);
				
				// UGLY				
				add_link = "<div class='add'><a href='#'>Add</a></div>";
				jobj.out = "<h3>"+add_link+"Vhosts</h3>";
		    
				jobj.out += listify(vhosts, function(item){return item;});
				return jobj;
			}
		});
	};
	$("#vhosts_link").click(updateVhostFunc);
	
	var updateUsersFunc = function() {
		url_load_into("/users", {
			success: function(jobj) {			
				var users = $(jobj.data.users);
				jobj.out = "<h3>Users</h3>";
				jobj.out += listify(users, function(item){return item;});
				
				return jobj;
			}
		});
	};
	$("#users_link").click(updateUsersFunc);
	
	var updateConnectionStatusFunc = function() {
		url_load_into("/conn/address/port/peer_address/peer_port/state/channels/user/vhost/timeout/frame_max/recv_oct/recv_cnt/send_oct/send_cnt/send_pend", {
			success: function(jobj) {
				var connections = $(jobj.data.conn)[0];
				jobj.out = "<h3>Connections</h3>";
				
				if (connections.conn == "") {
					jobj.out += "<br />No Connections";
				} else {
					jobj.out += listify(connections, function(obj){					
						traverse("conn", obj, function(key, val) {
							$("#conn_status").append("<li>"+key+" = "+val+"</li>");
						});		
					});			
				}
								
				return jobj;
			},
			error: function(e, xhr){
				$("#conn_status").append("<b>Error accessing connection</b>");
			}
		});
	};

});