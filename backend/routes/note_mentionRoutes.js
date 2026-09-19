const express = require("express");
const router = express.Router();
const pool = require("../db")

router.get("/", async (req, res) => {
    try {
        const { id_mention } = req.query;
        if (!id_mention) {
            return res.status(400).json({
                message: "id_mention est obligatoire"
            });
        }
        const result = await pool.query(
            `SELECT
                m.id_matiere,
                m.nom_matiere,
                m.coefficient
            FROM mention_matiere mm
            INNER JOIN matieres m
                ON m.id_matiere = mm.id_matiere
            WHERE mm.id_mention = $1
            ORDER BY m.nom_matiere`,
            [id_mention]
        );
        res.status(200).json(result.rows);
    }catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        });
    }
});
module.exports = router;