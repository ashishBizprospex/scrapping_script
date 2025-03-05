const puppeteer = require('puppeteer');
const pool = require('../config/db');
const inputs = require('../data/canvas.json');

async function scrapeData() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    for (const input of inputs) {
        const url = `https://awfsfair25.mapyourshow.com/8_0/floorplan/index.cfm?hallID=A&selectedBooth=${input.id}`;
        console.log(`🔗 Scraping: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Wait up to 20 seconds for selector to appear
            await page.waitForSelector('h1.exhibitor-name', { timeout: 20000 });

            // Retry mechanism for extracting name
            let name = await page.evaluate(() => {
                let nameElement = document.querySelector('h1.exhibitor-name');
                return nameElement ? nameElement.innerText.trim() : null;
            });

            if (!name) {
                console.log(`⏳ Retrying for ${url}...`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 sec and retry
                name = await page.evaluate(() => {
                    let nameElement = document.querySelector('h1.exhibitor-name');
                    return nameElement ? nameElement.innerText.trim() : "Not Available";
                });
            }

            const rawData = { booth_id: input.id, name };

            await pool.query(
                'INSERT INTO scraped_data (booth_id, name, raw_data) VALUES ($1, $2, $3)', 
                [input.id, name, JSON.stringify(rawData)]
            );

            console.log(`✅ Saved: ${name}`);
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);

            await pool.query(
                'INSERT INTO error_logs (script_name, error_message, error_stack) VALUES ($1, $2, $3)',
                ['scrape.js', error.message, error.stack]
            );
        }
    }

    await browser.close();
}

scrapeData();
