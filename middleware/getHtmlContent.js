const axios = require( 'axios');
const jsdom = require("jsdom");
const cheerio = require('cheerio');


function loadHTML() {
	const url_1 = process.env.INPUT_HTML_URL_1,
	url_2 = process.env.INPUT_HTML_URL_2;

if(!url_1 || !url_2)
 throw new Error('Source url not specified!');

	axios.get(url_1).then(response => {
		parseHTML(response.data);
	})
	axios.get(url_2).then(response => {
		parseHTML(response.data);
	})
} 

function parseHTML(htmlContent) {
const $ = cheerio.load(htmlContent);
const html = $('#lawcontent').html();
// html.removeAttr('#toolbar');

console.log(html);

	
}
module.exports = loadHTML;