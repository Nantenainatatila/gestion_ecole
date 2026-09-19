const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                mm.id_mention,
                m.nom_mention,
                mat.id_matiere,
                mat.nom_matiere,
                mat.coefficient
            FROM mention_matiere mm
            JOIN mentions m
                ON m.id_mention = mm.id_mention
            JOIN matieres mat
                ON mat.id_matiere = mm.id_matiere
            ORDER BY m.nom_mention,mat.nom_matiere
            
            `
        );
        res.json(result.rows);
    }catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
});

//Modification
router.put("/:id", async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;
        const {
            nom_matiere,
            coefficient,
            id_mention
        } = req.body;

        if (!nom_matiere || coefficient==="" || !id_mention) {
            return res.status(400).json({
                message:"Tous les champs sont obligatoires"
            });
        }
    
    await client.query("BEGIN");
    //Modification de la matiere
    const resultMatiere = await client.query(
        `
        UPDATE matieres
        SET
            nom_matiere = $1,
            coefficient = $2
        WHERE id_matiere = $3
        RETURNING *
        `, [nom_matiere, coefficient, id]
    );
    if (resultMatiere.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
            message:"Matiere introuvable"
        });
    }

    //modification de la mention de la matiere 

    const resultMention = await client.query(
        `
        UPDATE mention_matiere
        SET id_mention = $1
        WHERE id_matiere = $2
        RETURNING *
        `, [id_mention, id]
    );
    if (resultMention.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
            message: "Mention pour matiere introuvable"
        });
    }
    //Validation des deux modifications
    await client.query("COMMIT");

    res.json({
        message : "Matiere modifié avec succès",
        matiere: resultMatiere.rows[0],
        mentio_matiere: resultMention.rows[0]
    });

    } catch (error) {
        await client.query("ROLLBACK");
         console.error("Erreur de modification de matiere", error);

         res.status(500).json({
            message: "Erreu de la modification",
            error: error.message
         });
    } finally {
        client.release();
    }


});
module.exports = router;