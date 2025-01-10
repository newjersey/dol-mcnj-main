import fs from "fs-extra";
import { exec } from "child_process";

try {
  // Remove current build - commented out in Google Cloud Platform App Engine fix 2023-05-09
  // await fs.remove("./dist");
  // Copy front-end files
  // await fs.copy('./src/public', './dist/public');
  // await fs.copy('./src/views', './dist/views');
  // Transpile the TypeScript files
  exec("tsc --build tsconfig.prod.json", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
} catch (err) {
  console.error(err);
}
