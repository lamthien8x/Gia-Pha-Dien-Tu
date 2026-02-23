const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Login first
  console.log('Logging in...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.type('input[placeholder="Nhập email"]', 'admin');
  await page.type('input[type="password"]', 'admin');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Go to tree
  console.log('Navigating to tree...');
  await page.goto('http://localhost:3000/tree', { waitUntil: 'networkidle0' });
  
  // Wait for tree to render (look for canvas or a person card)
  await page.waitForSelector('.bg-gradient-to-br', { timeout: 10000 });
  
  // Take full mode screenshot
  console.log('Taking full mode screenshot...');
  // Hide top header just for a cleaner shot
  await page.evaluate(() => {
     const header = document.querySelector('header');
     if (header) header.style.display = 'none';
  });
  await page.screenshot({ path: '/Users/Apple/.gemini/antigravity/brain/e5c6076a-a631-4ea5-87e5-45bf3e3867ac/tree_zoom_full.png', fullPage: false });

  // Zoom out a bit -> compact mode
  console.log('Zooming to compact mode...');
  await page.mouse.move(500, 500); // Move to center of canvas
  
  // Simulate wheel zoom out
  for (let i = 0; i < 15; i++) {
     await page.mouse.wheel({ deltaY: 100 });
     await new Promise(r => setTimeout(r, 100)); // allow React to re-render
  }
  await page.screenshot({ path: '/Users/Apple/.gemini/antigravity/brain/e5c6076a-a631-4ea5-87e5-45bf3e3867ac/tree_zoom_compact.png', fullPage: false });
  
  // Zoom out further -> mini mode
  console.log('Zooming to mini mode...');
  for (let i = 0; i < 20; i++) {
     await page.mouse.wheel({ deltaY: 100 });
     await new Promise(r => setTimeout(r, 100));
  }
  await page.screenshot({ path: '/Users/Apple/.gemini/antigravity/brain/e5c6076a-a631-4ea5-87e5-45bf3e3867ac/tree_zoom_mini.png', fullPage: false });

  await browser.close();
  console.log('Done.');
})();
