const express = require("express");
const router = express.Router();

const pool = require("../db");

// Ajouter un etudiant

router.post("/", async (req, res) =>{
    try {
        const {nom, prenom, adresse, date_naissance, telephone, lieu_naissance} = req.body;
        const sequenceResult = await pool.query("SELECT nextval('matricule_seq') AS numero");
        const numero = sequenceResult.rows[0].numero;
        const matricule = `ETU-${String(numero).padStart(4,"0")}`;

        const result = await pool.query(
            `INSERT INTO etudiants (nom,prenom,adresse,date_naissance,telephone,matricule,lieu_naissance) 
            VALUES ($1,$2,$3,$4,$5,$6,$7) 
            RETURNING *`, [nom,prenom,adresse,date_naissance,telephone,matricule,lieu_naissance]
        );

    
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({
            message:console.error.message
            
        });
    }
});

//Recuperer l'etudiant par id_annee
router.get("/:id_annee", async (req, res) => {
    const { id_annee } = req.params;
    try {
        const result = await pool.query(
            `SELECT 
                e.id_etudiant,
                e.matricule,
                e.nom,
                e.prenom,
                e.adresse,
                e.date_naissance,
                e.telephone,
                e.lieu_naissance,
                m.nom_mention,
                n.niveau,
                a.annee 
            FROM inscriptions i
            LEFT JOIN etudiants e ON i.id_etudiant = e.id_etudiant
            LEFT JOIN mentions m ON i.id_mention = m.id_mention
            LEFT JOIN niveaux n ON i.id_niveau = n.id_niveau
            LEFT JOIN annee_scolaire a ON i.id_annee = a.id_annee
            WHERE i.id_annee = $1
            ORDER BY e.matricule
            
            `
            , [id_annee]
        );
        res.json(result.rows);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM etudiants ORDER BY nom"
        );
        res.json(result.rows);
    }catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
//recuperer l'etudiant par son id
router.get("/etudiant/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT 
                id_etudiant,
                nom,
                prenom,
                adresse,
                date_naissance,
                telephone,
                lieu_naissance
                
            FROM etudiants
            WHERE id_etudiant = $1
            
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
//Snuppressbion
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE  FROM etudiants WHERE id_etudiant = $1 RETURNING *", [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message:"Etudiant introvable"
            });
        }
        res.json({
            message:"Etudiant suppreimé",
            etudiant: result.rows[0]
        });
    }catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
//Modification

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {nom, prenom, adresse, date_naissance, telephone, lieu_naissance,id_inscription, id_mention, id_niveau, id_annee} = req.body;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        //modification pour l'etudiant
        await client.query(
            `
            UPDATE etudiants 
            SET
                nom = $1,
                prenom = $2,
                adresse = $3,
                date_naissance = $4,
                telephone = $5,
                lieu_naissance = $6
            WHERE id_etudiant = $7
            RETURNING *
            `,
            [nom, prenom, adresse, date_naissance, telephone, lieu_naissance, id]
        );
        //Modification pour l'inscription
        await client.query(
            `
            UPDATE inscriptions
            SET
                id_annee = $1,
                id_mention = $2,
                id_niveau = $3
            WHERE id_inscription = $4 AND id_etudiant = $5
            RETURNING *
            `,
            [id_annee, id_mention, id_niveau,id_inscription, id]
        );

        await client.query("COMMIT");

        res.json({
            message: "Etudiant modifié avec succès"
        });
    }catch (error) {
        await client.query("ROLLBACK");
        console.error(error.message);
        res.status(500).json({
            message: error.message
        });
    } finally {
        client.release();
    }
});
module.exports = router;