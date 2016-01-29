
 _bindKeyEvents = function(){
	 
	 var that = this,
		 keypress = false;
		 
	 document.addEventListener('keydown',function(eve){
		if(!keypress && eve.keyCode === 86){ 
			that.start();  // what is this ?
			keypress = true;
		}
	 });
	  
	 document.addEventListener('keyup',function(eve){
		if(!keypress && eve.keyCode === 86){ 
			that.start();  // what is this ?
			keypress = false;
		}
	 });
	 
	 start : function(){
		 
		var that = this;
		this.onresult = function(eve){
			that._result.call(that,eve);
		};
		 
		return this; 
	 }
	 
	 dispatchEvent  : function(eve){
		 
		Event.create(Event.Type.Click());
		 
	 }
	 
	 
	 
	 
 }