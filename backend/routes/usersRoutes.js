const express = require('express');
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/", async (req, res) => {
    
    try {
        const {name_user, email, mot_de_passe, role} = req.body;
      
        if (!name_user || !email || !mot_de_passe || !role) {
            return res.status(400).json({
                message: "tous les champs sont obligatoires"
            });
        }
        
        const existe = await pool.query(
            `SELECT id_user FROM users WHERE email = $1`, [email]
        );
        
        if (existe.rows.length > 0) {
            return res.status(409).json({
                message: "Cet email existe déjà"
            });
        }
        
        const hash = await bcrypt.hash(mot_de_passe, 10);
        console.log("apres bcrypt ");
        
        const result = await pool.query(
            `INSERT INTO users (name_user, email, mot_de_passe, role) VALUES($1, $2, $3, $4) 
            RETURNING *`, 
            [name_user, email,hash, role]
        );
        res.status(201).json({
            message: "Compte creé avec succès",
            utilisteur: result.rows[0]
        });
        console.log("insertion ok");
    } catch (error) {
        console.log("erreur de l'insertion d'utilisateur", error);
        res.status(500).json({
            message: error.message
        });
    }
});

// route login
router.post("/login", async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "email ou mot de passe incorrect"
            });
        }
        const utilisateur = result.rows[0];

        const valide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if(!valide) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }
        
        const token = jwt.sign(
            {
                id: utilisateur.id_user,
                role: utilisateur.role
            }, 
            process.env.JWT_SECRET,
            {
                
               expiresIn:"1d" 
            }
        );
        
        res.json({
            message:"connexion reussit",
            token,
            utilisateur: {
                id: utilisateur.id_user,
                name_user: utilisateur.name_user,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"erreur de connexion"
        });
    }
});        


router.get("/", async(req, res) => {
    try {
        const response = await pool.query(
            `SELECT * FROM users`
        );
        res.json(response.rows);
    } catch (error) {
        console.log("erreur de recuperation", error);
    }
});
module.exports = router;


