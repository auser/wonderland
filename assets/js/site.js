$(function(){
	
	// NOT VERY HAPPY WITH THIS
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
	
	function delete_data_to(data, url, opts) {
		$.ajax({
		      url: aliceUrl + url,
		      global: false,
		      type: "DELETE",
		      data: data,
		      dataType: "json",
		      success: opts.success
		   })
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
				
				var currentForm = '<form method="post" name="new_vhost_form" action="#">';
				currentForm += "<fieldset>";     

				currentForm += "<label for='vhost'>Vhost</label>";
				currentForm += "<input type='text' id='vhost_name' name='vhost' class='text-input'></input>";

				currentForm += '<input type="submit" value="Submit" class="submit"/>'
				currentForm += "</fieldset>";
				currentForm += "</form>";
				
				$(".hidden").html(currentForm);
				
				var newBinding = function() {					
					$(".add").click(function() {
						$(".hidden").show();
						jQuery.facebox($(".hidden"));
					});
					
					$(".remove a").click(function() {						
						var vhost = this.rel;
						var dataString = {"name" : vhost};
						console.log("json: %o", $.toJSON(dataString));
						delete_data_to($.toJSON(dataString), "/vhosts/"+vhost, {
							success: function(data) { 
								updateVhostFunc(); 
							}
						});
						return false;
					});
					
					$(".submit").click(function() {
						var vhost = $("#vhost_name").val();
						var dataString = {"name" : vhost};
						
						post_data_to($.toJSON(dataString), "/vhosts", {
							success: function(data) { 
								$.facebox.close();
								updateVhostFunc();
							}
						});
						return false;
					});
										
				};
				
				state.currentBinding.push(newBinding);
				
				// UGLY				
				// add_link = "<div class='add'><a href='#'>Add</a></div>";
				jobj.out = "<div class='large add'>Vhosts</div>";
		    
				jobj.out += listify(vhosts, function(item){
					if (item == "") {return null;} else {
						if (item == "/") {
							return "<a style='padding-left: 25px;' href='#' rel='"+item+"'>" + item + "</a>"
						} else {
							return "<div class='remove'><a href='#' rel='"+item+"'>" + item + "</a></div>";
						}						
					}
				});
				return jobj;
			}
		});
	};
	$("#vhosts_link").click(updateVhostFunc);
	
	var updateUsersFunc = function() {
			url_load_into("/users", {
				success: function(jobj) {
					var users = $(jobj.data.users);

					var currentForm = '<form method="post" name="new_user_form" action="#">';
					currentForm += "<fieldset>";     

					currentForm += "<label for='user'>username</label>";
					currentForm += "<input type='text' id='user_name' name='username' class='text-input'></input><br />";
					
					currentForm += "<label for='pass'>password</label>";
					currentForm += "<input type='password' id='pass' name='pass' class='text-input'></input><br />";

					currentForm += '<input type="submit" value="Submit" class="submit"/>'
					currentForm += "</fieldset>";
					currentForm += "</form>";

					$(".hidden").html(currentForm);

					var newBinding = function() {
						$(".add").click(function() {
							$(".hidden").show();
							jQuery.facebox($(".hidden"));
						});

						$(".remove a").click(function() {
							var user = this.rel;
							var dataString = {"name" : user};
							console.log("json: %o", $.toJSON(dataString));
							delete_data_to($.toJSON(dataString), "/users/"+user, {
								success: function(data) { 
									updateUsersFunc(); 
								}
							});
							return false;
						});

						$(".submit").click(function() {
							var user = $("#user_name").val();
							var pass = $("#pass").val();
							var dataString = {"username" : user, "password":pass};

							post_data_to($.toJSON(dataString), "/users", {
								success: function(data) { 
									$.facebox.close();
									updateUsersFunc();
								}
							});
							return false;
						});

					};

					state.currentBinding.push(newBinding);
					newBinding();

					// UGLY				
					// add_link = "<div class='add'><a href='#'>Add</a></div>";
					jobj.out = "<div class='large add'>users</div>";

					jobj.out += listify(users, function(item){
						if (item == "") {return null;} else {
							if (item == "/") {
								return "<a style='padding-left: 25px;' href='#' rel='"+item+"'>" + item + "</a>"
							} else {
								return "<div class='remove'><a href='#' rel='"+item+"'>" + item + "</a></div>";
							}						
						}
					});
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