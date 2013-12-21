$(function () {
	// This code is called immediately after the page is finished loading.
	// See http://api.jquery.com/jQuery/#jQuery3 for more information.

	// First hide the box container
	var box_content = $("#box_content");
	box_content.hide();

	// Use jQuery to get a list of all boxes from the HTML, and store that list in a variable called "boxes."
	// See http://api.jquery.com/category/selectors/ fo more information.
	var boxes = $("#grid li");


	// We want to do things to these boxes, so we're going to define a few functions.
	
	// We want to be able to enable boxes (i.e. make it so the user is allowed to click on them)
	var enable_box = function(index) {
		var box = $(boxes[index]);
		box.removeClass("disabled");
		box.addClass("enabled");
	};

	// We want to be able to highlight boxes (i.e. make it so the user is drawn to them)
	var highlight_box = function(index) {
		var box = $(boxes[index]);
		box.addClass("highlighted");

		// When a box is highlighte, we will also enable it
		enable_box(index);
	};

	// We also want to be able to "activate boxes" (i.e. react when the user clicks on them)
	var activate_box = function(index) {
		// The user just activated a box!
		
		// First, look up the box
		var box = $(boxes[index]);

		// If the box is disabled, stop.
		if(box.hasClass("disabled"))
			return;

		// Mark the box as viewed
		box.addClass("viewed");

		// Find the "a" tag that links to the box source
		var source_link = box.find(".box_source a");

		// Look up the URL associated with that link
		var source_url = source_link.attr("href");

		// Populate the box content with an iframe of that URL
		box_content.html("<iframe src='" + source_url + "'></iframe>");

		box_content.slideDown();

		// Enable the next box (but first make sure there IS a next box)
		if((index + 1) in boxes)
			enable_box(index + 1);
	}

	// Now we will go through each box.  We are going to set it up so that when the user clicks on it, it will "activate"
	// We are using the jQuery "each" method to go through "each" box.
	// See http://api.jquery.com/each/ for more information
	boxes.each(function(index, box) {
		// "boxes" is a list, but this code is being called one time for each element in that list.
		// jQuery has kindly given us the index (how far in the list we are, starting from 0 and increasing by 1 each time)
		// jQuery has also kindly given us the actual element we're looking at as well.
		// I got to name those parameters; I decided to call the index "index" and the element we're using "box"
		
		// The element given to us is just a basic HTML object, but I want to make it a jQuery object.
		// By passing the box into jQuery (that's the $ sign), we turn it into a jQuery object, which lets us do more things to it later.
		var box = $(box);

		// Now we enable activation for this box
		enable_box(index);

		box.click(function() {
			activate_box(index);
		});
	});

	// Enable the first box (in programming, 0 is always the first, not 1)
	activate_box(0);

	//
	var h = getQueryVariable("h");
	if(h) {
		var highlights = h.split(",");
		for(var x in highlights){
			var index = parseInt(highlights[x]);
			highlight_box(index);
		}
	}
	
	var gridWidth = 0;
	jQuery("ul#grid li").each(function() {
		jQuery(this).prepend("<div class='gridBar'></div>");
		var liWidth = jQuery(this).width();
		gridWidth += liWidth;
	}); // each method
	
	jQuery("ul#grid").css("width", gridWidth + 25);
	
	jQuery("ul#grid li").hover(function() {
		jQuery(this).find(".gridBar").stop().animate({
			"top": "-9px",
			"opacity": 1.0
		});
	}, function() {
		jQuery(this).find(".gridBar").stop().animate({
			"top": "0px",
			"opacity": 0
		});
	});
	var containerWidth = jQuery(".grid-crop-box").width();
	var gridOffset = jQuery("ul#grid").offset().left;
	var gridMove;
	var currentGridOffset = 0;
	var prevArrowToggle = false;
	var nextArrowToggle = false;
	
	
	jQuery(".grid-next").click(function() {
		currentGridOffset = parseInt(jQuery("ul#grid").css("left"));
		if (currentGridOffset <= (containerWidth-gridWidth) ) {
			gridMove = ((containerWidth-gridWidth)-30);
		} else {
			gridMove = "-=" + Math.round(gridWidth/10);
		}
		jQuery(this).parents(".grid-crop-box")
		.find("ul#grid").animate({
			"left": gridMove
		}, { queue: false }); // animate end
		
	}); // click
	
	jQuery(".grid-prev").click(function() {

		currentGridOffset = parseInt(jQuery("ul#grid").css("left"));
		if (currentGridOffset >= 0 ) {
			gridMove = 30;
		} else {
			gridMove = "+=" + Math.round(gridWidth/10);
		}
		jQuery(this).parents(".grid-crop-box")
		.find("ul#grid").animate({
			"left": gridMove
		}, { queue: false }); // animate end
		
	}); // click
	
	jQuery("ul#grid li").click(function() {
		jQuery("ul#grid li").removeClass("active");
		jQuery(this).addClass("active");
	}); // click
})