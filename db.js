const { Client } = require('pg');

const client = new Client({
    user: 'postgres', // Change this
    host: 'localhost',
    database: 'dummy_scrap',   // Change this
    password: 'admin', // Change this
    port: 5432,
});

client.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ Connection error", err));

module.exports = client;
