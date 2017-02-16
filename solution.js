var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var temp = new Object();

url = 'https://m.bnizona.com/index.php/category/index/promo';

var a = function() {
	return new Promise(function(resolve, reject) {
		request(url, function(error, response, html){
			var json;
			if(!error) {
				var $ = cheerio.load(html);
				var link;
				$('li a', 'ul.menu').each(function (){
					link = $(this).attr('href');
					foo(link);
				});
			};
		}); 

		function foo (url) {
			var str = "";
			request(url, function(error, response, body) {
				if(!error) {
					var $ = cheerio.load(body);
					var category;

					$('li.unavailable a', 'ul.breadcrumbs').each(function() {
						var category = $(this).text();
						// console.log(category);
						$('li a', 'ul.list2').each(function() {
							var title = $(this).children('span.merchant-name').text();
							var img = $(this).children('img').attr('src');
							var promoTitle = $(this).children('span.promo-title').text();
							var validUntil = $(this).children('span.valid-until').text();
							str += "{ title: " + title + ", image: " + img + ", promo: " + promoTitle + ", Valid Until: " + validUntil + "}, ";
						});
						temp[category] = '[' + str + ']';
					});
				}
			});
			
		}
	});
}

var b = function() {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			fs.writeFile('solution.json', JSON.stringify(temp), function(err) {
				console.log("File succesfully written");
			});
		}, 2000);
	});
}

a()
.then(b());