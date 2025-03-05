// const { Client } = require('pg');
// const config = require('./config.json');

// const client = new Client({
//     user: config.dbUser,
//     host: config.dbHost,
//     database: config.dbName,
//     password: config.dbPassword,
//     port: config.dbPort,
// });

// client.connect()
//     .then(() => console.log("✅ Connected to PostgreSQL"))
//     .catch(err => console.error("❌ Connection error", err));

// module.exports = client;
// "dbUser": "postgres",
// "dbHost": "localhost",
// "dbName": "dummy_scrap",
// "dbPassword": "admin",
// "dbPort": 5432
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dummy_scrap',
    password: 'admin',
    port: 5432
});

module.exports = pool;

