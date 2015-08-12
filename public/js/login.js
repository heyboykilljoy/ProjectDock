$.backstretch([
      "img/office-imac-mockup.jpg",
      "img/macbook-mock.jpg",
      "img/pro-mock-up.jpg",
      "img/air-mockup.jpg",
      ], {
        fade: 2000,
        duration: 4000
    });

$(document).on('ready', function() {

	setTimeout(function(){
		$('.front-text img').animate({opacity: 1}, 2000, function(){
			setTimeout(function(){
				$('.window-shade').animate({opacity: .85}, 2000, function(){
					$('a.btn.btn-default.btn-lg.login').animate({opacity: 1}, 2000);
				});
			}, 4000);
		});
	}, 6000);

});