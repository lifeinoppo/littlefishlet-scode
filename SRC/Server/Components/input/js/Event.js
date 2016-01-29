
 inherits from include('inputcomponents');  
 // if inherited from inputcomponents 
 // then must have following functions :
 /* 
	
	1. function provideHtml(){};
	2. function provideCss(){};   // chosable 
	js work with the above html and css both , if needed .
 
	*/

 function provideHtml(){
	 
	 // need to replace and fill in the  component and contents tags below
	 html = <component contents  draggable="true" ondragstart="drag(event)" ondragover="allowDrop(event)" ondrop="ondrop(event)" > ; 
	 
	 
 }	
	
	
 function ondragstart(event){
	 
	 event.dataTransfer.setData("Text",event.target.id);
	 
 }	
 
 function ondrop(event){
	 
	 
 }
 
 function ondragover(event){
	 
	 
 }

 var keyBoardEvent = {}
 
 
 evt.isMouseEvent  
 
 
 evt.isTouchEvent
 
 evt.isKeyBoardEvent
 
 