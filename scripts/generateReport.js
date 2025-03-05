const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function generateReport() {
    const { rowCount: totalScraped } = await pool.query('SELECT * FROM scraped_data');
    const { rowCount: totalProcessed } = await pool.query('SELECT * FROM processed_data');
    const { rowCount: totalChanges } = await pool.query('SELECT * FROM comparison_logs');
    const { rowCount: totalErrors } = await pool.query('SELECT * FROM error_logs');

    const report = {
        totalScraped,
        totalProcessed,
        totalChanges,
        totalErrors,
        generatedAt: new Date()
    };

    const filePath = path.join(__dirname, '../data/reports/report_' + Date.now() + '.json');
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

    await pool.query('INSERT INTO reports (total_scraped, total_processed, total_changes, total_errors, report_json) VALUES ($1, $2, $3, $4, $5)', 
        [totalScraped, totalProcessed, totalChanges, totalErrors, report]);

    console.log(`📄 Report generated: ${filePath}`);
}

generateReport();
