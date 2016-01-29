
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
			
			if( $(this).attr("text") === "drive" )
			{
				if( $('.clock-wrapper').hasClass('hidden') )
				{
					$('.clock-wrapper').removeClass('hidden');
				}
				else
				{
					$('.clock-wrapper').addClass('hidden');
				}
			}	
			
			
			if( $(this).attr("text") === "AnyDo" )
			{
				var data  = '<html><head>AnyDo</head><body><li>nodejs 数据持久化方案。</li><li>共享数据</li><li>IDE</li><li>Photo Gallery</li><li>Net resource Browser</li> <li>PDF browser <li>little effect tricks (such as for launcher .. )</li><li>full-stack  toolchain </li><li>screenshot ... </li></body></html>';
				$("#mainContent").html(data);
			}	
			
			// fragment for browser refresh ( partly )
			// useful here 
			if( $(this).attr("text") === "browser" )
			{
				var url="http://www.baidu.com";
				// var data = {type:1};
				$.ajax({
					type:"get",
					async:false, // sync with requests here 
					url:url,
					// data: data,
					timeout:1000,
					success:function(dates){
						$("#mainContent").html(dates);
					},
					error:function(err){
						console.log(err);
						alert("error!");
					}
				});
				$("#mainContent").html('<html><head> welcome to browser made by ourselves!</head><body>		<p id="p1">		one line begins 	</p></body></html>');
			}		
			// end of fragment for browser refresh ( partly )
					
				
		});
		
		
		
		
		
		
		
		
		
	
	});