import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  env: { ...process.env },
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        log(message: any) {
          console.log(message);
          return null;
        },
        table(message: any) {
          console.table(message);
          return null;
        },
      });
    },
    baseUrl: "http://localhost:3000",
  },
});
