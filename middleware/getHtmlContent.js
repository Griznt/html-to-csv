const axios = require( 'axios');
const cheerio = require('cheerio');


function loadAndParse() {
	return new Promise((resolve, reject) => {
			const url_1 = process.env.INPUT_HTML_URL_1,
			url_2 = process.env.INPUT_HTML_URL_2;

			if(!url_1 || !url_2)
				throw new Error('Source url not specified!');

const firstColumnHeader = process.env.FIRST_COLUMN || 'first',
secondColumnHeader = process.env.SECOND_COLUMN || 'second';

				loadHTML(url_1).then(parsedData1 => {
					loadHTML(url_2).then(parsedData2 => {
						const array = [];
						resolve(parsedData1.map((value,i) => {
							const jsonObj = {};
							jsonObj[firstColumnHeader] = value;
							jsonObj[secondColumnHeader] = parsedData2[i];
							return jsonObj; 
						}));

					}).catch(reject)
				}).catch(reject)
		})
} 

function loadHTML(url) {
	return new Promise((resolve, reject) => {
		axios.get(url).then(response => {
			resolve(parseHTML(response.data))
		}).catch(reject);
	})
} 

function parseHTML(htmlContent) {
	const $ = cheerio.load(htmlContent);
	const content = $(process.env.INPUT_HTML_ID);

	const arr = [];

	content.each(function() {
		$(this).children().each(function(i, elem) {
			if(elem.type === 'tag' && elem.name === 'div') {
				$(elem).children().each((j,elem2) => arr.push($(elem2).text().trim()))
			}
			else
				arr.push($(elem).text().trim());
		})
});
	return arr;
}
module.exports = loadAndParse;