const { Client } = require('pg');
const config = require('../config/config.json');

const client = new Client({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
});

client.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ Connection error", err));

module.exports = client;
