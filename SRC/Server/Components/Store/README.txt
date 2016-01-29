
here we use cheerio to replace jquery 
as server-side handle of htmls. 

and in the foundmental build of the presious 
lib, we are able to build some data-consist as a 
database.

here is an example :

<h2 class="key1">content 1</h2>

and after  $('h2.key1').text('new content 1');

we got 

<h2 class="key1">new content 1</h2>

via  $.html()

so a database is possible here. 