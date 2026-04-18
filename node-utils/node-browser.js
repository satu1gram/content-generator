// 🧪 NODE-ONLY UTILITY (OUTSIDE SRC)
const puppeteer = require('puppeteer');

/**
 * Launch or connect to local browser.
 */
module.exports = {
  getBrowser: async (token) => {
    if (token) {
      console.log('🌐 Remote Node Sync: Connecting via Browserless...');
      return await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${token}`,
      });
    }

    console.log('💻 Local Node Sync: Launching Puppeteer...');
    return await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
  }
};
