const puppeteer = require('puppeteer-core');
const { createServer } = require('http');

const PORT = process.env.PORT || 8080;
const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/usr/bin/chromium';

let browser = null;

async function getBrowser() {
  if (browser && browser.connected) return browser;
  browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
    headless: true,
  });
  browser.on('disconnected', () => { browser = null; });
  return browser;
}

const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  if (req.method !== 'POST' || req.url !== '/screenshot') {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const { html, viewport, options } = JSON.parse(body);
      const width  = viewport?.width  || 1080;
      const height = viewport?.height || 1080;
      const clip   = options?.clip    || { x: 0, y: 0, width, height };

      const b    = await getBrowser();
      const page = await b.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

      const screenshot = await page.screenshot({ type: 'png', clip });
      await page.close();

      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(screenshot);
    } catch (err) {
      console.error('Screenshot error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Screenshot service listening on port ${PORT}`);
});
