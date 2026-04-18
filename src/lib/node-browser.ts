// 💻 NODE-ONLY UTILITY
import puppeteer from 'puppeteer';

/**
 * Encapsulated browser launcher to prevent leakage.
 */
module.exports = {
  getBrowser: async (token?: string) => {
    if (token) {
      console.log('🌐 Remote Sync: Connecting via Browserless...');
      return await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${token}`,
      });
    }

    console.log('💻 Local Sync: Launching Puppeteer...');
    return await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
  }
};
