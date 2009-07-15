;(function($) {
  var app = $.sammy(function() { with(this) {
    element_selector = '#content';
    
		var context = this;
    var loaded = false;
		// helpers
	  var error = function(text) {context.trigger('error', {message: text});}
		var notice = function(text) {context.trigger('notice', {message: text});}
    
    // display tasks
    get('#/', function() { with (this) {
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