const express = require("express");
const router = express.Router();
const pool = require("../db")

router.get("/", async (req, res) => {
    try {
        const {
            id_annee, id_mention, id_niveau
        } = req.query;
        if (!id_annee || !id_mention || !id_niveau) {
            return res.status(400).json({
                message: " les id de niveau, annee et mentions sont obligatoires"
            });
        }
        const result = await pool.query(
            `SELECT
                i.id_inscription,
                e.id_etudiant,
                e.nom,
                e.prenom,
                i.id_annee,
                i.id_mention,
                i.id_niveau
            FROM inscriptions i
            INNER JOIN etudiants e
                ON e.id_etudiant = i.id_etudiant
                
            WHERE i.id_annee = $1
                AND i.id_mention = $2
                AND i.id_niveau = $3
            ORDER BY e.id_etudiant`,
            [id_annee, id_mention, id_niveau]
        );
        res.json(result.rows);
    }catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
});
module.exports = router;