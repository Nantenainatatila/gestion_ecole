const express = require("express");
const router = express.Router();
const pool = require("../db")

router.get("/dashboard/:idAnnee", async (req, res) => {
    try {
        const { idAnnee } = req.params;
        const etudiants = await pool.query(
            `SELECT COUNT(*) AS total 
                FROM inscriptions 
                WHERE id_annee = $1
            `, [idAnnee]
        );
       
        res.json(Number(etudiants.rows[0].total));
    }catch (error) {
        console.log("erreur de recuperation de nombre d'étudiant", error);
        res.status(500).json({
            message: error.message
        });
    }
});
// Selon les filieres
router.get("/dashboard/filliere/:idAnnee", async(req, res) => {
    try {
        const { idAnnee } = req.params;
        const result = await pool.query(
            `
            SELECT
                m.id_mention,
                m.nom_mention,
                COUNT(DISTINCT i.id_etudiant) AS total_etudiants
            FROM mentions m
            LEFT JOIN inscriptions  i
                ON i.id_mention = m.id_mention
                AND i.id_annee = $1
            GROUP BY
                m.id_mention,
                m.nom_mention
            ORDER BY m.nom_mention`,
            [idAnnee]
        );
        res.json(result.rows);
        
    } catch (error) {
        console.log("erreur de recuperation par filiere", error);
        res.status(500).json({
            message: message.error
        });
    }
})
module.exports = router;