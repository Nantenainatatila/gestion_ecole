const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/admission", async (req, res) => {
    try {
        const {  idAnnee, idMention, idNiveau, idTypeExamen  } = req.query;
        const result = await pool.query(
            `
                WITH moyennes AS (
                    SELECT
                        i.id_inscription,
                        COALESCE(
                            SUM(n.note * mat.coefficient) 
                            / NULLIF(SUM(mat.coefficient), 0), 0
                        ) AS moyenne
                    
                    FROM inscriptions i
                    LEFT JOIN notes n
                        ON n.id_inscription = i.id_inscription
                        AND n.id_type_examen = $4

                    LEFT JOIN matieres mat
                        ON mat.id_matiere = n.id_matiere
                    WHERE i.id_annee = $1
                        AND i.id_mention = $2
                        AND i.id_niveau = $3

                    GROUP BY i.id_inscription
                )

                SELECT 
                    COUNT(*)::integer AS total_etudiant,
                    COUNT(*) FILTER (
                        WHERE moyenne >= 10)::integer AS admis,
                    
                    COUNT(*) FILTER (
                        WHERE moyenne < 10)::integer AS non_admis

                FROM moyennes
            `, [
                 Number(idAnnee), Number(idMention), Number(idNiveau), Number(idTypeExamen)
            ]
        );
        const resultNombreMat = await pool.query(
            `SELECT 
                COUNT(DISTINCT mat.id_matiere) AS total_matiere
            FROM mention_matiere mm
            LEFT JOIN matieres mat 
                ON mat.id_matiere = mm.id_matiere
            WHERE id_mention = $1
            `, [idMention]
        );
        const resultlistMat = await pool.query(`
                SELECT 
                    mat.id_matiere,
                    mat.nom_matiere
                FROM mention_matiere mm
                LEFT JOIN matieres mat
                    ON mat.id_matiere = mm.id_matiere
                    WHERE id_mention = $1
                    `, [idMention]
        );

        const totalMatiere = Number(resultNombreMat.rows[0].total_matiere);
        const listesMat = resultlistMat.rows;
        const data = result.rows[0];
        const total = Number(data.total_etudiant);
        const admis = Number(data.admis);
        const nonAdmis = Number(data.non_admis);
        const pourcentage = total > 0 ? ((admis / total) * 100).toFixed(2) : "0.00";

        
        res.json({
            total_etudiants: total, admis,
            non_admis: nonAdmis,
            pourcentage_admission: Number(pourcentage),
            totalMatiere: totalMatiere,
            listesMat: listesMat
        });
        
    }catch (error) {
        console.log("erreu de recuperation des nombres d'admis et non admis", error);
        res.status(500).json({
            message: error.message
        });
    }
});
module.exports = router;