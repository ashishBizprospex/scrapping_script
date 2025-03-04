const puppeteer = require('puppeteer');
const { saveToDB } = require('./saveData');
const { generateReport } = require('./report');
const inputs = require('../data/canvas.json');

async function scrapeData() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });

    for (let i = 0; i < inputs.length; i++) {
        let url = `https://awfsfair25.mapyourshow.com/8_0/floorplan/index.cfm?hallID=A&selectedBooth=${inputs[i].id}`;
        console.log(`🔗 Scraping: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForSelector('h1.exhibitor-name', { timeout: 10000 });

            let name = await page.evaluate(() => {
                let nameElement = document.querySelector('h1.exhibitor-name');
                return nameElement ? nameElement.innerText.trim() : "Name not available";
            });

            console.log(`✅ Scraped Name: ${name}`);
            await saveToDB(name);
        } catch (error) {
            console.error(`❌ Error scraping ${url}:`, error.message);
        }
    }

    await browser.close();
    await generateReport();
}

scrapeData();
