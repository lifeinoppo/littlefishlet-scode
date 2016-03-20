var jsonp = require();



 $.ajax({
	dataType:'jsonp',
	data:'id=10',
	jsonp : 'jsonp_callback',
	url:'http:www.baidu.com',
	success:function(data){
		 console.log(" data got ... : "+data);
	}
	 
 });