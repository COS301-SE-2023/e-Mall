/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'cypress';
import mergeReports from 'cypress-sonarqube-reporter/mergeReports';
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here

      on('after:run', results => {
        // /!\ don't forget to return the Promise /!\
        return mergeReports(results, {
          mergeFileName: 'coverage.xml',
          mergeOutputDir: 'coverage/cypress',
        });
      });
      return config;
    },
    baseUrl: 'http://localhost:4200',
    reporter: 'cypress-sonarqube-reporter',
    reporterOptions: {
      // outputDir: './coverage',
      overwrite: true,
      // mergeFileName: 'coverage.xml',
      // see "Reporter Options" section
    },
  },
});
