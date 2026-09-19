const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM matieres ORDER BY nom_matiere"
        );
        res.json(result.rows);
    }catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get matier par id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `
            SELECT 
                m.id_matiere,
                m.nom_matiere,
                m.coefficient,

                mm.id_mention
            FROM matieres m
            JOIN mention_matiere mm
                ON mm.id_matiere = m.id_matiere
            WHERE m.id_matiere = $1
            
            `, [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message:"Matiere introuvable"
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
router.post("/", async (req, res) => {
    try {
        const {nom_matiere, coefficient} = req.body;
        const result = await pool.query(`
            INSERT INTO matieres (nom_matiere,coefficient) 
            VALUES ($1,$2)
            RETURNING *`, [nom_matiere, coefficient]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
});
//Suppression de matiere
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE  FROM matieres WHERE id_matiere = $1 RETURNING *", [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message:"matiere introvable"
            });
        }
        res.json({
            message:"Matiere suppreimé",
            etudiant: result.rows[0]
        });
    }catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports = router;