const pool = require('../config/db');

async function compareData() {
    const oldData = await pool.query('SELECT * FROM processed_data');
    const newData = await pool.query('SELECT * FROM scraped_data');

    for (const newRecord of newData.rows) {
        const oldRecord = oldData.rows.find(old => old.booth_id === newRecord.booth_id);

        if (oldRecord && oldRecord.name !== newRecord.name) {
            const changeSummary = `Name changed from '${oldRecord.name}' to '${newRecord.name}'`;

            await pool.query('INSERT INTO comparison_logs (booth_id, old_data, new_data, change_summary) VALUES ($1, $2, $3, $4)', 
                [newRecord.booth_id, oldRecord, newRecord, changeSummary]);

            console.log(`🔄 Change detected: ${changeSummary}`);
        }
    }
}

compareData();
