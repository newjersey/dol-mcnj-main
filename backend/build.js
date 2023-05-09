const fs = require("fs-extra");
const childProcess = require("child_process");

try {
  // Remove current build - commented out in Google Cloud Platform App Engine fix 2023-05-09
  //fs.removeSync("./dist");
  // Copy front-end files
  // fs.copySync('./src/public', './dist/public');
  // fs.copySync('./src/views', './dist/views');
  // Transpile the typescript files
  childProcess.exec("tsc --build tsconfig.prod.json");
} catch (err) {
  console.log(err);
}
