
BM25.Tokenize = function(text){
	
	text  = text
			.toLowerCase()
			.replace(/\W/g,' ')
			.replace(/\s+/g,' ')
			.trim()
			.split(' ')
			.map(function(a){ return stemmer(a); });
			
	// filter out stopStems
	var out = [];
	for(var i=0~length)
		if(stopStems.indexOf(text[i]) === -1){
			out.push(text[i]);
		}
	
	return out;
	
	
	
}