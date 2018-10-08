const axios = require("axios");
const fs = require("fs");
const path = require("path");

const base_url =
  "https://mydomain.myshopify.com/admin/customers.json?limit=250";

const dirName = "output";
if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);

start();

function addFiltersToUrl(url, filters) {
  let newUrl = url;
  filters.forEach((filter, i) => {
    if (i === 0 && !url.includes("?")) newUrl += `?${filter}`;
    else newUrl += `&${filter}`;
  });
  return newUrl;
}

function sendRequest(url) {
  return new Promise((resolve, reject) =>
    axios
      .get(url)
      .then(response => {
        if (response.data) return resolve(response.data);
        else reject("no JSON data returned");
      })
      .catch(error => {
        try {
          if (error.response.data) return resolve(error.response.data);
          else reject("no JSON data returned");
        } catch (error) {
          console.log("MEGA ERROR", error);
        }
      })
  );
}

function start() {
  const results = [];
  const pageCount = 11;
  for (let i = 1; i <= pageCount; i++) {
    const filter = `page=${i}`;
    const url = addFiltersToUrl(base_url, [filter]);
    const filename = `file-${i}`;
    sendRequest(url)
      .then(json => {
        console.log("Result obtained!", json);
        saveResultInFile({ json, filename });
      })
      .catch(error => console.error("error!!!", error));
  }
}

async function saveResultInFile({ json, filename }) {
  const filePath = path.join(dirName, `${filename}.txt`);
  const writeStream = fs.createWriteStream(filePath);
  writeStream.write(JSON.stringify(json));
  writeStream.end();
}
