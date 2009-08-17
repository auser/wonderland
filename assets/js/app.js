(function($) {
  var app = $.sammy(function() { with(this) {
    element_selector = '#content';
    
		var context = this;
    var loaded = false;
		// helpers
	  var error = function(text) {context.trigger('error', {message: text});}
		var notice = function(text) {context.trigger('notice', {message: text});}
    
    // display tasks    
    get('#/', function() { with (this) {
			get_page("/dashboard", {
				success: function(data) {
				  get_page("/control/status", {
				    success: function(d) {
    				  data.status = $(d.status)[0];
    				  
    				  get_page("/system", {
    				    success: function(a) {
    				      data.system = $(a.system)[0];
    				      partial('/assets/templates/dashboard.html', data);
    				    },
    				    error: function() {return "BAH";}
    				  });
				    },
				    error: function() {return "";}
				  });
				},
				error: function() {error("Unable to load dashboard");}
			});
    }});
    
    get('#/status', function() { with (this) {
      get_page("/control/status", {
        success: function(data) {partial('/assets/templates/node_status.html', $(data.status)[0]);},
        error: function() {error("Unable to load vhost information");}
      });
    }});

    get('#/vhosts', function() { with (this) {			
			get_page("/vhosts", {
				success: function(data) {partial('/assets/templates/vhosts.html', data);},
				error: function() {error("Unable to load vhosts");}
			});
    }});

    get('#/users', function() { with (this) {			
			get_page("/users", {
				success: function(data) {partial('/assets/templates/users.html', data);},
				error: function() {error("Unable to load users");}
			});
    }});
    
    get('#/permissions', function() { with (this) {			
			get_page("/permissions", {
				success: function(data) {partial('/assets/templates/permissions.html', data);},
				error: function() {error("Unable to load permissions");}
			});
    }});
    
    get('#/bindings', function() { with (this) {			
			get_page("/bindings", {
				success: function(data) {partial('/assets/templates/bindings.html', data);},
				error: function() {error("Unable to load bindings");}
			});
    }});
    
    get('#/exchanges', function() { with (this) {			
			get_page("/exchanges", {
				success: function(data) {partial('/assets/templates/exchanges.html', data);},
				error: function() {error("Unable to load exchanges");}
			});
    }});

    get('#/connections', function() { with (this) {			
			get_page("/conn/address/port/peer_address/peer_port/state/channels/user/vhost/timeout/frame_max/recv_oct/recv_cnt/send_oct/send_cnt/send_pend", {
				success: function(data) {partial('/assets/templates/connections.html', {conns: $(data.conn)})},
				error: function() {error("Unable to load connections");}
			});
    }});

    get('#/queues', function() { with (this) {
			var vhost;
			if (params["name"]) {vhost = params["name"];} else {vhost = "root"};
	get_page("/queues/"+vhost+"/name/durable/auto_delete/arguments/messages_ready/messages_unacknowledged/messages_uncommitted/messages/acks_uncommitted/consumers/transactions/memory", {
				success: function(data) {partial('/assets/templates/queues.html', data)},
				error: function() {error("Unable to load queues");}
			});
    }});

    get('#/rabbit_status', function() { with (this) {
			redirect("#/");
			return false;
    }});
    
    bind('loaded', function() { with(this) { redirect('#/'); }});
    
    bind('error', function(e, data) { with(this) {show_div(data, "#error");}});
		bind('notice', function(e, data) { with(this) {show_div(data, "#notice");}});
    
    
  }});
  
  $(function() {
    app.run('#/');
  })
  
})(jQuery);