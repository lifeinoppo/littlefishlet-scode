
 // first we will need jQuery included 
 
 
 jQuery(document).ready(function(){
	// set a shot button for screenshot 
	// named after  'screenshot'
	// ��������һ��ȫ�ֿ�ݼ�Ҳ�ǲ����ѡ��
	
	console.log(" inittial ");
	
		
		console.log("clicked");
		
		event.preventDefault();
		html2canvas(document.body,{
			allowTaint : true,
			taintTest : false,
			onrendered : function(canvas){
				canvas.id = "mycanvas";
				// ����base64 ͼƬ����
				var dataUrl = canvas.toDataURL();
				var newImg = document.createElement("img");
				newImg.src = dataUrl;
				document.body.appendChild(newImg);
				window.open(newImg.src);
			}
		})
		
	
	 
 });