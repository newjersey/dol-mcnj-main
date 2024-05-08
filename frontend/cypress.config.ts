import { defineConfig } from "cypress";
import * as fs from "fs";

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
      }),
          on(
              'after:spec',
              (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
                if (results && results.video) {
                  // Do we have failures for any retry attempts?
                  const failures = results.tests.some((test) =>
                      test.attempts.some((attempt) => attempt.state === 'failed')
                  )
                  if (!failures) {
                    // delete the video if the spec passed and no tests retried
                    fs.unlinkSync(results.video)
                  }
                }
              }
          )
    },
    baseUrl: "http://localhost:3000",
    video: true,
    defaultCommandTimeout: 10000  // Timeout in milliseconds
  },
});
