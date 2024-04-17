const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: "0101",
    host: "localhost",
    post: 5432,
    database: "quizdb"
})

module.exports = pool