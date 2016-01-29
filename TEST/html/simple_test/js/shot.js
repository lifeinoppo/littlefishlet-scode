
 // first we will need jQuery included 
 
 
 jQuery(document).ready(function(){
	// set a shot button for screenshot 
	// named after  'screenshot'
	// 或者设置一个全局快捷键也是不错的选择
	
	console.log(" inittial ");
	
		
		console.log("clicked");
		
		event.preventDefault();
		html2canvas(document.body,{
			allowTaint : true,
			taintTest : false,
			onrendered : function(canvas){
				canvas.id = "mycanvas";
				// 生成base64 图片数据
				var dataUrl = canvas.toDataURL();
				var newImg = document.createElement("img");
				newImg.src = dataUrl;
				document.body.appendChild(newImg);
				window.open(newImg.src);
			}
		})
		
	
	 
 });