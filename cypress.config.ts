import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL,
        setupNodeEvents(on, config) {
            return config;
        },
        env: {
            BASE_URL: process.env.CYPRESS_BASE_URL,
            allureReuseAfterSpec: false,
            snapshotOnly: false,
            allure: true,
            allureLogCypress: true,
        },
        projectId: '',
        experimentalRunAllSpecs: true,
        experimentalOriginDependencies: true,
        defaultCommandTimeout: 25000,
        requestTimeout: 25000,
        responseTimeout: 25000,
        video: false,
        videosFolder: 'cypress/videos',
        watchForFileChanges: true,
        screenshotOnRunFailure: true,
        screenshotsFolder: 'cypress/screenshots',
        trashAssetsBeforeRuns: true,
        downloadsFolder: 'cypress/downloads',
        chromeWebSecurity: false,
        numTestsKeptInMemory: 3,
        experimentalMemoryManagement: true,
        retries: {
            runMode: 1,
            openMode: 0,
        },
        viewportHeight: 1080,
        viewportWidth: 1920,
    },
});
