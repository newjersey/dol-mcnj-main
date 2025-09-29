const fs = require("fs-extra");
const childProcess = require("child_process");
const path = require("path");

async function build() {
  try {
    console.log("🔨 Building backend TypeScript...");
    
    // Remove old builds
    if (fs.existsSync("./dist_old")) {
      fs.removeSync("./dist_old");
    }
    
    // Backup current dist if it exists
    if (fs.existsSync("./dist")) {
      fs.moveSync("./dist", "./dist_old");
    }
    
    // Remove dist_temp if it exists
    if (fs.existsSync("./dist_temp")) {
      fs.removeSync("./dist_temp");
    }
    
    // Transpile the typescript files
    console.log("📦 Compiling TypeScript...");
    await new Promise((resolve, reject) => {
      childProcess.exec("tsc --build tsconfig.prod.json", (error, stdout, stderr) => {
        if (error) {
          console.error("TypeScript compilation failed:", error);
          reject(error);
          return;
        }
        if (stderr) {
          console.log("TypeScript warnings:", stderr);
        }
        if (stdout) {
          console.log("TypeScript output:", stdout);
        }
        resolve();
      });
    });
    
    // Move dist_temp to dist
    if (fs.existsSync("./dist_temp")) {
      console.log("📁 Moving compiled files from dist_temp to dist...");
      fs.moveSync("./dist_temp", "./dist");
    } else {
      throw new Error("TypeScript compilation did not create dist_temp directory");
    }
    
    console.log("✅ Backend build completed successfully!");
    
  } catch (err) {
    console.error("❌ Backend build failed:", err);
    process.exit(1);
  }
}

build();
