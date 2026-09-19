const express = require("express");
const router = express.Router();
const pool = require("../db")

router.get("/etudiant/:id", async (req, res) =>{
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT 
                e.id_etudiant,
                e.nom,
                e.prenom,

                i.id_inscription,
                i.id_mention,
                i.id_annee,

                m.id_matiere,
                m.nom_matiere,
                m.coefficient

             FROM etudiants e
             JOIN inscriptions i
                ON e.id_etudiant = i.id_etudiant
             JOIN mention_matiere mm
                ON i.id_mention = mm.id_mention
             JOIN matieres m 
                ON mm.id_matiere = m.id_matiere
            WHERE e.id_etudiant = $1
            ORDER BY m.nom_matiere
        `, [id]);
        res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({
            message:console.error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {id_mention, id_matiere} = req.body;
        const result = await pool.query(`
            INSERT INTO mention_matiere (id_mention, id_matiere)
            VALUES ($1,$2)
            RETURNING *`, [id_mention, id_matiere]
        );
        res.json(result.rows[0]);
    } catch {
        console.error(error);
        res.status(500).json({
            message:console.error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM mention_matiere ORDER BY id_mention_matiere"
        );
        res.json(result.rows);
    }catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
module.exports = router;