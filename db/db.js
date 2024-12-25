const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7754074',
    password: 'V6TP4w7eTj',
    database: 'sql7754074',
    port: 3306,
});

module.exports = pool;