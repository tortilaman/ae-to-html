const htmlStandards = require('reshape-standard');
const cssStandards = require('spike-css-standards');
const jsStandards = require('spike-js-standards');
const Records = require('spike-records');
const fs = require('fs');


let locals = {};
let jsonData = {
  iconsArray: []
};

function populateJSON(r) {
  for (var key in r) {
    // console.log("Func populateJSON() " + key);
    var title = key.replace("-", " ").replace("./", "").replace(".json", "");
    var id = title.replace(" ", "");
    var uri = "assets/anim/" + key.replace("./", "");
    // console.log('Func populateJSON() Raw Data: \n' + 'Title: ' + title + '\n' + 'ID: ' + id + '\n' + 'URI: ' + uri);
    var obj = {
      title: title,
      id: id,
      URI: uri,
      desc: ""
    };
    // console.log(obj);
    // console.log('Func populateJSON() OBJ Data: \n' + 'Title: ' + obj[title] + '\n' + 'ID: ' + obj[id] + '\n' + 'URI: ' + obj[uri]);
    jsonData.iconsArray.push(obj);
  }
}

function readFiles(dirname) {
  let data = {};
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        console.log("Func fs.readdir() Error reading directory");
        onError(err);
        return;
      }
      let requests = filenames.map( function(item) {
          return new Promise((resolve, reject) => {
            var URI = dirname + item;
            fs.readFile(URI, 'utf-8', (err, content) => {
              if (err) {
                reject(Error("Func fs.readFile() Error reading file " + URI));
                return;
              }
              //Ensure only JSON files are included
              if(item.split(".").slice(-1) == "json") {
                // console.log("Func fs.readFile() " + item);
                data[item] = content;
                resolve(data[item]);
              }
              //Not a JSON file
              else {
                resolve(item + " isn't a JSON file");
                return
              }
            });
          });
      });

      Promise.all(requests).then((response) => {
        //Directory contents have been added to data
        if (JSON.stringify(data) !== "{}") {
          // console.log("Func readFiles() successfully parsed data!");
          resolve(data);
        }
        //Done goofed somehow
        else {
          reject(Error("Func readFiles() didn't parse data. Data is " + data));
        }
      }, reason => {
        console.log(reason);
      });
    });
  });

}

function getJson() {
  return new Promise((resolve, reject) => {
    readFiles('assets/anim/').then(function(response) {
      console.log("Func getJson() Completed reading files");
      populateJSON(response);
      console.log("Func getJson() Completed populating JSON");
      var jsonResult = JSON.stringify(jsonData.iconsArray, null, 2);
      // Show Results
      // console.log("Func getJson() jsonResult is: \n" + jsonResult);
      resolve(jsonData.iconsArray);
    });
  });
}

module.exports = {
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'views/templates/*.sgr'],
  reshape: htmlStandards({
    locals: () => locals
  }),
  postcss: cssStandards(),
  babel: jsStandards(),
  plugins: [
    new Records({
      addDataTo: locals,
      iconsArray: {
        data: getJson()
      }
    })
  ],
  vendor: 'assets/vendor/**'
};
