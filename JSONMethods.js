const fs = require('fs');
/********************************************************************************
 *  Takes data[] passed from readFiles() which is an array of filenames and     *
 *  creates an array of all the different data we'll need to generate the page. *
 *                                                                              *
 *  @param {array} r Array of filenames.                                        *
 *  @return {array} Array of titles, IDs, and URIs.                             *
 ********************************************************************************/
function populateJSON(r) {
  let arr = [];
  for (var key in r) {
    var title = key.replace(/-/g, " ").replace("./", "").replace(".json", "");
    var id = title.replace(/ /g, "");
    var uri = "assets/anim/" + key.replace("./", "");
    var obj = {
      title: title,
      id: id,
      URI: uri,
      desc: ""
    };
    arr.push(obj);
  }
  return arr;
}

/********************************************************************
 *  readFiles - Gets all JSON files and their contents.             *
 *  @param  {String} dirname the directory to get JSON files from.  *
 *  @return {array}          array of filenames and their contents. *
 ********************************************************************/

function readFiles(dirname) {
  let data = {};
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        console.log("Func fs.readdir() Error reading directory");
        return;
      }
      let requests = filenames.map(function(item) {
        return new Promise((resolve, reject) => {
          let URI = dirname + item;
          fs.readFile(URI, 'utf-8', (err, content) => {
            if (err) {
              reject(Error("Func fs.readFile() Error reading file " + URI));
              return;
            }
            //JSON files added to data
            if (item.split(".").slice(-1) == "json") {
              data[item] = content;
              resolve(data[item]);
            }
            //Non JSON files
            else {
              resolve(item + " isn't a JSON file");
              return;
            }
          });
        });
      });

      /**
       *  When all Promises have been resolved (all JSON files have been added
       *  to data[]), we proceed.
       */
      Promise.all(requests).then((response) => {
        //  There is data in data[];
        if (JSON.stringify(data) !== "{}") {
          //  Data is defined in readFiles(), so it  has to be passed using
          //  resolve() to be in scope of getJson().
          resolve(data);
        }
        //data[] is empty.
        else {
          reject(Error("Func readFiles() didn't parse data. Data is " + data));
        }
      }, reason => {
        console.log(reason);
      });
    });
  });

}

/**
 *  Putting it all together, this function creates the promise that
 *  spike-records will evaluate and turn into our JSON.
 *
 *  @method getJson
 *
 *  @param {String} direcotry Where to look for JSON
 *  @return {array} JSData has each file's title, ID, and URI for the interface.
 */
module.exports = function getJson(directory) {
  return new Promise((resolve, reject) => {
    readFiles(directory).then(function(response) {
      console.log("Func getJson() Completed reading files");
      let JSData = populateJSON(response);
      console.log("Func getJson() Completed populating JSON");
      var jsonResult = JSON.stringify(JSData, null, 2);
      // Show Results
      // console.log("Func getJson() jsonResult is: \n" + jsonResult);
      resolve(JSData);
    });
  });
};
