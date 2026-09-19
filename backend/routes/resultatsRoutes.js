const express = require("express");
const router = express.Router();


const pool = require("../db");

router.get("/resultat", async (req, res) => {
    try {
        const {
            id_annee, id_mention, id_niveau, id_type_examen
        } = req.query;

        if (!id_annee || !id_mention || !id_niveau || !id_type_examen) {
            return res.status(400).json({
                message: "Annee, mention, niveau, type d'examen obligatoire"
            });
        }
        //recuperer un étudiant
        const resultEtudiant = await pool.query(
            `
            SELECT 
                e.id_etudiant,
                e.matricule,
                e.nom,
                e.prenom,
                i.id_inscription,
                a.annee,
                m.nom_mention,
                n.niveau
                

                
            FROM etudiants e
            INNER JOIN inscriptions i ON i.id_etudiant = e.id_etudiant
            LEFT JOIN annee_scolaire a ON i.id_annee = a.id_annee
            LEFT JOIN mentions m ON i.id_mention = m.id_mention
            LEFT JOIN niveaux n ON i.id_niveau = n.id_niveau

                

            WHERE 
                    i.id_annee = $1
                    AND i.id_mention = $2
                    AND i.id_niveau = $3
                    AND EXISTS (
                        SELECT 1 
                        FROM notes n
                        WHERE n.id_inscription = i.id_inscription
                            AND n.id_type_examen = $4
                    )
            
            ORDER BY e.nom, e.prenom
                `, 
                    [
                        id_annee,id_mention,id_niveau,id_type_examen
                    ]
        );

        //Matiere de la mention

        const resultMatieres = await pool.query(
            `
            SELECT 
                m.id_matiere,
                m.nom_matiere,
                m.coefficient
            FROM matieres m
            INNER JOIN mention_matiere mm
                ON mm.id_matiere = m.id_matiere
                
            WHERE mm.id_mention = $1
            ORDER BY m.nom_matiere
            `, [id_mention]
        );
        const resultNotes = await pool.query(
            `
            SELECT 
                n.id_inscription,
                n.id_matiere,
                n.note
            
                
            FROM notes n

            WHERE n.id_type_examen = $1
            `, [id_type_examen]                                                                                             
        );
        //type_examen

        const resultType = await pool.query(`
            SELECT type_examen FROM types_examen WHERE id_type_examen = $1`, [id_type_examen]
        );

        //Construction des resultats

        const resultats = resultEtudiant.rows.map(
            etudiant => {
                let total = 0;
                let totalCoefficient = 0;

                const matieres = resultMatieres.rows.map(
                    matiere => {
                        const note = resultNotes.rows.find(
                            n => 
                                n.id_inscription === etudiant.id_inscription && n.id_matiere === matiere.id_matiere
                        );
                        const valeurNote = note ? Number(note.note) : null ;

                        if (valeurNote !== null) {
                            total += valeurNote * Number(matiere.coefficient);
                            totalCoefficient += Number(matiere.coefficient);
                        }

                        return {
                            id_matiere: matiere.id_matiere,
                            nom_matiere: matiere.nom_matiere,
                            coefficient: Number(matiere.coefficient),
                            note: valeurNote
                        };
                    }
                );
                const moyenne = totalCoefficient > 0 ? total / totalCoefficient : 0;
                const type_examen = resultType.rows[0]?.type_examen;

                return {
                    id_etudiant: etudiant.id_etudiant,
                    matricule: etudiant.matricule,
                    id_inscription: etudiant.id_inscription,
                    nom: etudiant.nom,
                    prenom: etudiant.prenom,
                    annee: etudiant.annee,
                    mention: etudiant.nom_mention,
                    type_examen: type_examen,
                    niveau: etudiant.niveau,
                    matieres,
                    total,
                    moyenne
                };
            }
        );

        //Trier par moyenne
        resultats.sort(
            (a,b) => 
                b.moyenne - a.moyenne
        );
        //Ajouter le rang
        resultats.forEach(
            (etudiant, index) => {
                etudiant.rang = index + 1;

                etudiant.observation = etudiant.moyenne >= 10 ? "Admis" : "Non admis";
            
        });

        res.json({
            matieres : resultMatieres.rows, resultats
        });

    } catch (error) {
        console.error("Erreur de resultat", error);
        res.status(500).json({
            message: "erreue server",
            error: error.message
        });
    }
    
});

module.exports = router;