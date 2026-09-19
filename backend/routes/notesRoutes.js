const express = require("express");
const router = express.Router();
const pool = require("../db");


router.post("/", async (req, res) => {
    const client = await pool.connect();
    try {
        const notes = req.body;
        if (!Array.isArray(notes) || notes.length === 0) {
            return res.status(400).json({
                message: "Aucune note à enregistrer"
            });
        }
        await client.query("BEGIN");

        for (const item of notes) {
            const {
                id_inscription,
                id_matiere,
                id_type_examen,
                note
            } = item;

            if (!id_inscription || !id_matiere || !id_type_examen || note === undefined || note === "") {
                await client.query("ROLLBACK");
                return res.status(400).json({
                    message: "Tous les champs sont obligatoires"
                });
            }

            if (Number(note) < 0 || Number(note) > 20 ) {
                await client.query("ROLLBACK");
                return res.status(400).json({
                    message: "Notes compreis entre 0 et 20"
                });
            }

            await client.query(
                `INSERT INTO notes 
                (
                    id_inscription,
                    id_matiere,
                    note,
                    id_type_examen
                )
                VALUES ($1,$2,$3,$4)
                `,
                [
                    id_inscription,
                    id_matiere,
                    note,
                    id_type_examen
                ]
            );
            await client.query("COMMIT");
        }
        
        res.status(201).json({
            message: "Notes enregistrées avec succès"
        });
    }catch (error) {
        await client.query("ROLLBACK");
        console.error(error)
        

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Cet étudiant a dejà des notes pour ces matiers et ce type d'examen"
            });
        }
        res.status(500).json({
            message: error.message
        });
    } finally {
        client.release();
    }
});
// get inscription pour la modification
router.get("/inscription/:idInsciption", async (req, res) => {
    try {
        const { idInsciption } = req.params;
        const { id_type_examen } = req.query;
        
        const result = await pool.query(
            `
            SELECT 
                m.id_matiere,
                m.nom_matiere,
                m.coefficient,
                n.id_note,
                n.note
                
            FROM inscriptions i

            INNER JOIN mention_matiere mm
                ON mm.id_mention = i.id_mention
            
            INNER JOIN matieres m 
                ON m.id_matiere = mm.id_matiere

            LEFT JOIN notes n
                ON n.id_matiere = m.id_matiere
                AND n.id_inscription = i.id_inscription
                AND n.id_type_examen = $2
                
            WHERE 
                i.id_inscription = $1
                
            ORDER BY m.nom_matiere
            `,
            [idInsciption, Number(id_type_examen)]
        );
        res.json(result.rows);
    }catch (error) {
        console.error("erreur de recuperation de notes", error);
        res.status(500).json({
            message: error.message
        });
    }
});
//modification de note

router.post("/modifier", async (req, res) => {
    
    
    try {
        
        const { id_inscription, id_type_examen, id_matiere, note } = req.body;
       
       const result = await pool.query(
        `INSERT INTO notes (
            id_inscription,
            id_type_examen,
            id_matiere,
            note) VALUES ($1, $2, $3, $4)
            
            ON CONFLICT (
                id_inscription,
                id_matiere,
                id_type_examen
            )
            DO UPDATE SET 
                note = EXCLUDED.note
                
            RETURNING *
            `, [
                Number(id_inscription),Number(id_type_examen), Number(id_matiere), Number(note)
            ]
       );
       res.json(result.rows[0]);
      
       
    } catch(error) {
        console.error("Erreur de modification des notes", error);
        res.status(500).json({
            error: error.message
        });
    }

});
// route suppression des notes
router.delete("/:idInscription/:idTypeExamen", async (req, res) => {
    try {
        const { idInscription, idTypeExamen } = req.params;
        const result = await pool.query(
            "DELETE  FROM notes WHERE id_inscription = $1 AND id_type_examen = $2 RETURNING *", [Number(idInscription), Number(idTypeExamen)]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message:"note introvable"
            });
        }
        res.json({
            message:"Note suppreimé",
            etudiant: result.rows[0]
        });
    }catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
// get pour la relevé des notes
router.get("/releve/:idInscription", async( req, res) => {
    try {
        const { idInscription } = req.params;
        const { id_type_examen } = req.query;

        const etudiantResult = await pool.query(
            `
            SELECT 
                e.id_etudiant,
                e.matricule,
                e.nom,
                e.prenom,
                e.date_naissance,
                e.lieu_naissance,
                i.id_inscription,
                a.annee,
                me.nom_mention,
                n.niveau,
                te.type_examen
                
            FROM inscriptions i
            INNER JOIN etudiants e
                ON e.id_etudiant = i.id_etudiant

            INNER JOIN annee_scolaire a
                ON a.id_annee = i.id_annee
                
            INNER JOIN mentions me
                ON me.id_mention = i.id_mention
                
            INNER JOIN niveaux n
                ON n.id_niveau = i.id_niveau

            INNER JOIN types_examen te
                ON te.id_type_examen = $2

            WHERE i.id_inscription = $1
            `,
            [
                Number(idInscription), Number(id_type_examen)
            ]
        );
        if (etudiantResult.rows.length === 0 ) {
            return res.status(404).json({
                message: "Etudiant ou inscription introuvable"
            });
        }
        const notesResult = await pool.query(
            `
            SELECT
                m.id_matiere,
                m.nom_matiere,
                m.coefficient,
                n.id_note,
                n.note
            FROM inscriptions i
            INNER JOIN mention_matiere mm
                ON mm.id_mention = i.id_mention
                
            INNER JOIN matieres m
                ON m.id_matiere = mm.id_matiere
                
            LEFT JOIN notes n
                ON n.id_inscription = i.id_inscription
                AND n.id_matiere = m.id_matiere
                AND n.id_type_examen = $2
                
            WHERE i.id_inscription = $1
            ORDER BY m.nom_matiere
            `,
            [
                Number(idInscription), Number(id_type_examen)
            ]
        );

        // calcul de note et moyenne

        let totale = 0;
        let totalCoefficient = 0;
        let totalBut = 0;

        notesResult.rows.forEach(matiere => {
            if (matiere.note !== null) {
                const note = Number(matiere.note);
                const coefficient = Number(matiere.coefficient);

                totale += note * coefficient;
                totalCoefficient += coefficient;
                totalBut += 20 * coefficient;
            }
            
        });

        const moyenne = totalCoefficient > 0 ? totale / totalCoefficient : 0 ;
        
        // observation
        let observation;

        if (moyenne >= 10) {
            observation = "Admis";
        } else {
            observation = "Non admis"
        }

        // mention
        let mention2;
        if (moyenne < 13 ) {
            mention2 = "Passable";
        } else if (moyenne < 14) {
            mention2 = "Assez-bien";
        } else if(moyenne < 15) {
            mention2 = "Bien";
        } else {
            mention2 = "Très bien";
        }

        // response

        res.json({
            etudiant: {
                id_etudiant: etudiantResult.rows[0].id_inscription,
                id_inscription: etudiantResult.rows[0].id_inscription,
                matricule: etudiantResult.rows[0].matricule,
                nom: etudiantResult.rows[0].nom,
                prenom: etudiantResult.rows[0].prenom,
                date_naissance: etudiantResult.rows[0].date_naissance,
                lieu_naissance: etudiantResult.rows[0].lieu_naissance,
                annee: etudiantResult.rows[0].annee,
                mention: etudiantResult.rows[0].nom_mention,
                niveau: etudiantResult.rows[0].niveau,
                type_examen: etudiantResult.rows[0].type_examen,
                matieres: notesResult.rows,
                totale: Number(totale.toFixed(2)),
                moyenne: Number(moyenne.toFixed(2)),
                observation,
                totalCoefficient: Number(totalCoefficient),
                mention2,
                totalBut: Number(totalBut)
            }
        });
    } catch (error) {
        console.error("erreur de noute relevé", error);
        res.status(500).json({
            message: "Erreur de serveur",
            error: error.message
        });
    }
});
module.exports = router;