import puppeteer from 'puppeteer';

/**
 * 💻 NODE-ONLY: Launch or Connect to Browser
 * This file should NEVER be imported in the Edge Runtime.
 */
export const getBrowser = async (token?: string) => {
  if (token) {
    console.log('🌐 Node Environment: Connecting to Remote Browser...');
    return await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${token}`,
    });
  }

  console.log('💻 Node Environment: Launching Local Puppeteer...');
  return await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
};
