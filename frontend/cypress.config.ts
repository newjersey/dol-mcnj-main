import { defineConfig } from "cypress";

export default defineConfig({
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