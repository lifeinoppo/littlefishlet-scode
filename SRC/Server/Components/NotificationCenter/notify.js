


function notify_me(){
	// do notifying work here , delay for 1.2s first 

	setTimeout( function() {

		// noop 
		
		// create the notification
		var notification = new NotificationFx({
			message : '<span class="icon icon-megaphone"></span><p>You have some interesting news in your inbox. Go <a href="#">check it out</a> now.</p>',
			layout : 'bar',
			effect : 'slidetop',
			type : 'notice', // notice, warning or error
			onClose : function() {
				// noop
			}
		});

		// show the notification
		notification.show();

	}, 1200 );
					
}


