const client = require('./db');

async function saveToDB(name) {
    try {
        // Fetch old data before inserting new one
        const oldData = await client.query("SELECT name FROM exhibitors WHERE name = $1", [name]);
        
        if (oldData.rows.length > 0) {
            console.log(`🟡 Data already exists: ${name}`);
            return oldData.rows[0].name;
        }

        // Insert new data
        await client.query("INSERT INTO exhibitors (name) VALUES ($1)", [name]);
        console.log(`📥 Saved to DB: ${name}`);
        return null; // No old data (new entry)
    } catch (err) {
        console.error("❌ DB Insert Error:", err.message);
    }
}

async function fetchAllData() {
    try {
        const res = await client.query("SELECT * FROM exhibitors ORDER BY id");
        return res.rows;
    } catch (err) {
        console.error("❌ Fetch Data Error:", err.message);
        return [];
    }
}

module.exports = { saveToDB, fetchAllData };
