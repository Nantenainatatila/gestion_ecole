require("dotenv").config();
const pool = require("../db");


pool.query("SELECT NOW()", (err,result) => {
    if (err) {
        console.error("Erreur de postgresSQL", err);
    } else {
        console.log("Neon connecté", result.rows[0]);
    }
    pool.end();
});