
var cheerio = require("cheerio"); 

var utils = require("nodutils"); // lib to be required for file read-write

$ = cheerio.load('<h2 class="title">Hello World</h2>');


var CONSTS = {
	
	// variable dbPrefix and dbPostfix  decides where to init the db file 
	
	dbPrefix :  'db/db_',
	
	dbPostfix : '.db',
	
	// end of db file init 
	
};


// ToDo List : enable  multi-layer key-val pair 
// such as   set('key1.key2.key3','val')

var db = {
	
	dbName : "",
	
	init : function(name){
		utils.file.exists((CONSTS.dbPrefix+name+CONSTS.dbPostfix),function(exists){
			if(!exists){
				// file not exist, create db now 
				$ = cheerio.load('<head>'+name+'</head>'); 
				var data = $.html();
				utils.file.write((CONSTS.dbPrefix+name+CONSTS.dbPostfix),data,null,function(err){
					// console.log("file created under the db directory currently ... ");
				});  // in the db directory
				
			}else{
				// console.log("db file already exists here, no need to create again ... ");
			}			
		});
	},
	
	retrive : function(dbName){
		// must be called before every set and get operation
		db.dbName = dbName;
		return this;
	},

	set : function(key,val){
		
		utils.file.exists( (CONSTS.dbPrefix+db.dbName+CONSTS.dbPostfix) ,function(exists){
			if(exists){
				
				db.dataToWriteIntoDb = "";

				utils.file.read( (CONSTS.dbPrefix+db.dbName+CONSTS.dbPostfix) ,null,function(err,data){
					
					if( err == null ){
							$ = cheerio.load(data);
							// if key already exist, avoid repeatedly val set 
							if( $('#pairs .'+key, $) !== null ){
								// console.log(" no need for a repeated val-set ");
								$('#pairs').children('.'+key).text("newval");
							}else{
							
								$('#pairs').append('	<li class='+key+'>'+val+'</li>\n');
								//console.log($.html());
								// after read, we do write operation, consider about this again 
								// weather need to move write op outside of this read loop circle 		
							}	
							utils.file.write((CONSTS.dbPrefix+db.dbName+CONSTS.dbPostfix),$.html(),null,function(err){
									if(!err){
										// console.log(" db updated under the db directory currently ... ");
									}else{
										console.log("something is wrong : "+err);
									}	
							}); 
							
					}else{
						// there is err 
						console.log(" there is something wrong  ");
					}
					
				} );
				
			}else{
				console.log("db file does not exists here, call db.init to create one first ... ");
			}			
		});
		
	},
	
	get : function(key,callback){
		
		var textForReturn="defaults";
		
		// console.log(" db retriving is : "+ (CONSTS.dbPrefix+db.dbName+CONSTS.dbPostfix) );
		
		utils.file.exists( (CONSTS.dbPrefix+db.dbName+CONSTS.dbPostfix) ,function(exists){
			if(exists){

				utils.file.read( (CONSTS.dbPrefix+db.dbName+CONSTS.dbPostfix)  ,null,function(err,data){
					
					if( err == null ){
							// console.log("data retrived is : "+data);
							$ = cheerio.load(data); 
							if( $('#pairs .'+key, $) !== null ){
								// console.log("  find one value for the key looking for  ");
								
								var text = $('#pairs').children('.'+key).text();

								// make vallback here 
								callback.call(this,text);
								
							}else{
								console.log(" the key currently looking for does not exist ... ");
							}
							
					}else{
						// there is err 
					}
					
				} );
				
			}else{
				console.log("db file does not exists here, call db.init to create one first ... ");
			}			
		});
		
	},
	
	dbExistsLocally : function(){
		// use nodutils util to make a judgement 
		// temporarily return false 
		return false;
	}
};


var test  = {

	
	test : function(){
		
		console.log("running test here ... ");
		db.init("1");
		
		db.retrive("1").get("name",function(val){
			console.log("return val got : "+val);
		});
		
		db.retrive("1").set("name","jxc");
		
	}
	
};


test.test();
