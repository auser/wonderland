var app = $.sammy(function() { with(this) {	
	
	debug = true;
	element_selector = '#content';
  
  get('#/', function() { with(this) {
    $('#content').text('Welcome!');
  }});

}});

$(function() {
  app.run();
});