// const puppeteer = require('puppeteer');
// const client = require('./db');
// const inputs = require('./canvas.json');

// async function scrapeData() {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1600, height: 900 });

//     for (let i = 0; i < inputs.length; i++) {
//         let url = `https://awfsfair25.mapyourshow.com/8_0/floorplan/index.cfm?hallID=A&selectedBooth=${inputs[i].id}`;
//         console.log(`🔗 Scraping: ${url}`);

//         try {
//             await page.goto(url, { waitUntil: 'domcontentloaded' });
//             await page.waitForSelector('h1.exhibitor-name', { timeout: 10000 });
        
//             let name = await page.evaluate(() => {
//                 return document.querySelector('h1.exhibitor-name') 
//                     ? document.querySelector('h1.exhibitor-name').innerText.trim() 
//                     : "Name not available";
//             });
        
//             console.log(`✅ Scraped Name: ${name}`);
//             await saveToDB(name);
//         } catch (error) {
//             console.error(`❌ Error scraping: ${error}`);
//         }
        
//     }

//     await browser.close();
//     client.end(); // Close DB connection
// }

// async function saveToDB(name) {
//     try {
//         await client.query("INSERT INTO exhibitors (name) VALUES ($1)", [name]);
//         console.log(`📥 Saved to DB: ${name}`);
//     } catch (err) {
//         console.error("❌ DB Insert Error:", err);
//     }
// }

// scrapeData();
// const puppeteer = require('puppeteer');
// const client = require('./db');
// const inputs = require('./canvas.json');

// async function scrapeData() {
//     const browser = await puppeteer.launch({
//         headless: 'new', // Change to 'true' if issues persist
//         args: ['--no-sandbox', '--disable-setuid-sandbox'] // Helps with server compatibility
//     });

//     const page = await browser.newPage();
//     await page.setViewport({ width: 1600, height: 900 });

//     for (let i = 0; i < inputs.length; i++) {
//         let url = `https://awfsfair25.mapyourshow.com/8_0/floorplan/index.cfm?hallID=A&selectedBooth=${inputs[i].id}`;
//         console.log(`🔗 Scraping: ${url}`);

//         try {
//             await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
//             await page.waitForSelector('h1.exhibitor-name', { timeout: 10000 });

//             let name = await page.evaluate(() => {
//                 let nameElement = document.querySelector('h1.exhibitor-name');
//                 return nameElement ? nameElement.innerText.trim() : "Name not available";
//             });

//             console.log(`✅ Scraped Name: ${name}`);
//             await saveToDB(name);

//         } catch (error) {
//             console.error(`❌ Error scraping ${url}:`, error.message);
//         }
//     }

//     await browser.close();
//     client.end(); // Close DB connection
// }

// async function saveToDB(name) {
//     try {
//         await client.query("INSERT INTO exhibitors (name) VALUES ($1)", [name]);
//         console.log(`📥 Saved to DB: ${name}`);
//     } catch (err) {
//         console.error("❌ DB Insert Error:", err.message);
//     }
// }

// scrapeData();

const { chromium } = require('playwright');
const client = require('./db');
const inputs = require('./canvas.json');

async function scrapeData() {
    const browser = await chromium.launch({ headless: true }); // No need for Chrome installation
    const page = await browser.newPage();

    for (let i = 0; i < inputs.length; i++) {
        let url = `https://awfsfair25.mapyourshow.com/8_0/floorplan/index.cfm?hallID=A&selectedBooth=${inputs[i].id}`;
        console.log(`🔗 Scraping: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForSelector('h1.exhibitor-name', { timeout: 10000 });

            let name = await page.textContent('h1.exhibitor-name');
            name = name ? name.trim() : "Name not available";

            console.log(`✅ Scraped Name: ${name}`);
            await saveToDB(name);

        } catch (error) {
            console.error(`❌ Error scraping ${url}:`, error.message);
        }
    }

    await browser.close();
    client.end();
}

async function saveToDB(name) {
    try {
        await client.query("INSERT INTO exhibitors (name) VALUES ($1)", [name]);
        console.log(`📥 Saved to DB: ${name}`);
    } catch (err) {
        console.error("❌ DB Insert Error:", err.message);
    }
}

scrapeData();

