const pool = require('../config/db');

async function processData() {
    const { rows } = await pool.query('SELECT * FROM scraped_data');

    for (const record of rows) {
        const processedInfo = { cleanedName: record.name.toUpperCase() };

        await pool.query('INSERT INTO processed_data (booth_id, name, processed_info) VALUES ($1, $2, $3)', 
            [record.booth_id, record.name, processedInfo]);

        console.log(`✅ Processed: ${record.name}`);
    }
}

processData();
