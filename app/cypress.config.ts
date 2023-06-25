/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    reporter: 'mocha-junit-reporter',
    // video: false,
    reporterOptions: {
      mochaFile: 'coverage/cypress/coverage.xml',
      // video: false,
      // quiet: true,
      // see "Reporter Options" section
    },
  },
});
