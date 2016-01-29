
     jQuery(document).ready(function() {
		// inner variables
		
		// first make things invisible 
		$('.example').addClass('hidden');
		
		function setActive(elem) {
			// not useful currently 
			if( elem.hasClass('active') )
				elem.removeClass('active');
			else
				elem.addClass('active');
			
		}
		
		$('.item img').click(function () {
			console.log(" clicked 2 ");   // use TAG instead and our own log class later 
			setActive($(this));
			console.log($(this).attr("src"));
			if( $(this).attr("text") === "music" )
			{
				if( $('.example').hasClass('hidden') )
				{
					$('.example').removeClass('hidden');
				}
				else
				{
					$('.example').addClass('hidden');
				}
			}	
					
				
		});
	
	});