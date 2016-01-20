
all apps will get accessed after installed. 

/*
	eg : url = "app/filebrowser"
	this url should be treated after a icon-button clicked. 
	this is the time router take over 
	
	cmd = get(&path)
	cmd = move(&oldname ... )


*/

var commands = {
	
	"/install"  : _install   ,    // the install commands 
	
	"/app"   :   _launch   ,    // launch an app commands
	
	
	
};