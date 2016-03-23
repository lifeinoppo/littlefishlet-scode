/*eslint handle-callback-err:1*/
'use strict';

var parser = require('../lib/index');
var assert = require('assert');

describe('parser', function() {
	it('should whrow error for invalid text/language', function() {
		assert.throws(function() {
			parser.parse();
		});
		assert.throws(function() {
			parser.parse('text', '__');
		});
	});

	it('should filter quotes', function() {
		var text = '"Nu cred ca este adevarat!", a spus Vlad Filat';
		var quotes = parser.parse(text, 'ro', {
			minLength: 100
		});
		assert.equal(0, quotes.length);
	});

	it('should parse simple quote', function() {
		var quotes = parser.parse('"Nu cred ca este adevarat!", a spus Vlad Filat', 'ro', {
			minLength: 15
		});
		assert.equal(1, quotes.length);
		assert.equal('Nu cred ca este adevarat!', quotes[0].text);
		assert.equal(1, quotes[0].index);
		assert.equal('Vlad Filat', quotes[0].name.text);
	});

	it('should find quote & author', function() {
		var text = 'Plus "Nu cred ca este adevarat!", a spus Vlad Filat';
		var quotes = parser.parse(text, 'ro', {
			minLength: 15,
			persons: [{
				index: 41,
				id: 101
			}]
		});
		assert.equal(1, quotes.length);
		var quote = quotes[0];
		assert.equal('Nu cred ca este adevarat!', quote.text);
		assert.equal(6, quote.index);
		assert.equal('Vlad Filat', quote.name.text);
		assert.equal(101, quote.author.id);
	});

	it('should find quote in a big text', function() {
		var text = 'Comisia Europeană a adoptat o serie de programe de cooperare transfrontalieră, care au un buget total de un miliard de euro și sunt destinate să sprijine dezvoltarea socială și economică a regiunilor situate de ambele părți ale frontierelor externe ale UE.\n„Cooperarea transfrontalieră este esențială pentru evitarea creării unor noi linii de separare. Această nouă finanțare va contribui la o dezvoltare regională mai integrată și mai durabilă a regiunilor frontaliere învecinate și la o cooperare teritorială mai armonioasă în zona frontierelor externe ale UE”, a declarat Johannes Hahn, comisarul pentru politica europeană de vecinătate și negocieri privind extinderea, potrivit unui comunicat transmis joi de Reprezentanța CE la București, notează Agerpres.ro.\n„Sunt foarte mulțumită că Fondul European de Dezvoltare Regională poate contribui la apropierea UE de vecinii săi. Programele de cooperare transfrontalieră reprezintă exemple concrete ale modului în care UE acționează pentru a-i ajuta pe cetățeni să facă față unor provocări comune, creând astfel un veritabil sentiment de solidaritate și stimulând în același timp competitivitatea economiilor locale”, a declarat Corina Crețu, comisarul pentru politica regională.';
		var quotes = parser.parse(text, 'ro', {
			minLength: 15,
			persons: [{
				index: 1179,
				id: 101
			}]
		});
		// console.log(quotes);
		assert.equal(2, quotes.length);
	});

	it('EN: should filter START quotes', function() {
		var text = 'Some text.\nTrump added: "By the way, I released my financial statements..."';
		var quotes = parser.parse(text, 'en');
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal('Trump', quotes[0].name.text);
	});

	it('EN: should filter END quotes', function() {
		var text = '"It\'s a hellacious problem," said Hugh Ray';
		var quotes = parser.parse(text, 'en', { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal('Hugh Ray', quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text = '"It\'s a hellacious problem," said Hugh Ray to the...';
		quotes = parser.parse(text, 'en', { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal('Hugh Ray to the...', quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text = '"I\'ll win states that aren\'t in play." Trump said.';
		quotes = parser.parse(text, 'en');
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal('Trump', quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text = '"Jeb fought very hard," the billionaire businessman said. "It wasn\'t his time. That\'s all."';
		quotes = parser.parse(text, 'en', { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal('the billionaire businessman', quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text = 'Photo: Jason DeFillippo\n“My parents never really told me I couldn’t do anything.” – Shaun White\nThis particular episode comes from a fun event. “I believe that peace means that one person has the biggest stick. I build those sticks.” – Walter O’Brien';
		quotes = parser.parse(text, 'en');
		// console.log(quotes);
		assert.equal(2, quotes.length);
		assert.equal('Shaun White', quotes[0].name.text);
		assert.equal(25, quotes[0].index);
		assert.equal('Walter O’Brien', quotes[1].name.text);
	});

	it('NBSP: should filter web page', function(done) {
		var fs = require('fs');
		var path = require('path');

		fs.readFile(path.join(__dirname, 'data', 'fhww-blog.txt'), function(error, text) {
			if (error) {
				return done(error);
			}
			var quotes = parser.parse(text, 'en');
			assert.ok(quotes.length > 0);
			done();
		});
	});

	it('EN: should parse new line quote author\'s name', function() {
		var text = '"It\'s a hellacious problem,"\n \t- Hugh Ray';
		var quotes = parser.parse(text, 'en', { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal('Hugh Ray', quotes[0].name.text);
		assert.equal(1, quotes[0].index);
	});

	it('EN: should fail invalid new line quote author\'s name', function() {
		var text = '"It\'s a hellacious problem,"\n \t- Hugh Ray jhsgfhgsdh gsdhj gdhjsgf sdgjsdf jgdfhjs';
		var quotes = parser.parse(text, 'en', { minLength: 10 });
		assert.equal(0, quotes.length);

		text = '"It\'s a hellacious problem,"\n \t- \nHugh Ray';
		quotes = parser.parse(text, 'en', { minLength: 10 });
		assert.equal(0, quotes.length);
	});

	it('should work with extraRules option', function() {
		var text = '“I believe that everything happens for a reason...”\n \t― \nMarilyn Monroe';
		var options = {
			minLength: 10,
			extraRules: [{
				reg: /“([^\f\t\v“”„]{10,})”[ \t\u00A0]*[\n\r]+[ \t\u00A0]*[\u2010-\u2015-][ \t\u00A0\r\n]*([^\f\n\r\t\v,]{3,30})(?:$|[\n\r])/gi,
				quote: 0,
				name: 1
			}]
		};

		var quotes = parser.parse(text, 'en', options);

		assert.equal(1, quotes.length);
		assert.equal('Marilyn Monroe', quotes[0].name.text);
	});
});
