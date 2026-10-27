// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout : 40*1000,
  expect:{
    timeout: 40*1000,
  },
  reporter:'html',
  use: {
    baseURL:'http://3.129.154.1:8000/',
    browserName: 'chromium',
    screenshot: 'on',
    trace: 'on',
    headless: false,
    video: 'on',
    
  },

  /* Configure projects for major browsers */
 

  
});