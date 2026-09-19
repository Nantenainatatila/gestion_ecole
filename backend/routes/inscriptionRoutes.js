const express = require("express");
const router = express.Router();
const pool = require("../db")

router.post("/", async (req, res) =>{
    try {
        const {id_etudiant, id_annee, id_mention, id_niveau} = req.body;
        const result = await pool.query(
            `INSERT INTO inscriptions (id_etudiant, id_annee, id_mention, id_niveau) 
            VALUES ($1,$2,$3,$4) 
            RETURNING *`, [id_etudiant, id_annee, id_mention, id_niveau]
        );
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({
            message:console.error.message
            
        });
    }
});
//get inscription
router.get("/etudiant/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT 
                id_inscription,
                id_etudiant,
                id_annee,
                id_mention,
                id_niveau
            FROM inscriptions
            WHERE id_etudiant = $1
            ORDER BY id_inscription DESC
            LIMIT 1
            `, [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message:"Introuvable"
            });
        }
        res.json(result.rows[0]);
    }catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
});
module.exports = router;