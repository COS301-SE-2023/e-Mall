/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    reporter: 'cypress-sonarqube-reporter',
    reporterOptions: {
      outputDir: './coverage',
      overwrite: true,
      mergeFileName: 'coverage.xml',
      // see "Reporter Options" section
    },
  },
});
