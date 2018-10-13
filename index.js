const getHtmlContent= require("./middleware/getHtmlContent");

const Json2csvParser = require('json2csv').Parser;

const axios = require("axios");
const fs = require("fs");
const path = require("path");

require('dotenv').config();

const dirName = "output";
if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);

start();

function start() {
  getHtmlContent()
  .then(res => saveResultInFile({json: res, filename: 'outputfile'}))
  .catch(error => console.error(`HTML content loading error: ${error.toString()}`));
}

async function saveResultInFile({ json, filename }) {
  
  try {
    const parser = new Json2csvParser( { 
      fields: [
        process.env.FIRST_COLUMN || "first", 
        process.env.SECOND_COLUMN || "second"
      ]});
    const csv = parser.parse(json);
                                           
    const filePath = path.join(dirName, `${filename}.csv`);
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(csv);
    writeStream.end();
  } catch (err) {
    console.error(`File saving error: ${err.toString()}`);
  }
}
