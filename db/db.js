const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: "0101",
    host: "2.tcp.eu.ngrok.io",
    port: 11678,
    database: "quizdb"
})

module.exports = pool