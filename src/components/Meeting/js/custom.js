// JavaScript Document

$(document).ready(function(){
	$('.popup-modal').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#username',
		modal: true
	});
	$(document).on('click', '.popup-modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
	
	$('.meeting_rooms_table_slider').owlCarousel({
	    center: true,
	    items:3,
	    loop:true,
	    nav:true,
	    dots:false,
	    responsive:{
	        769:{
	            items:3
	        },
	        320:{
	            items:1
	        }
	    }
	});
});




