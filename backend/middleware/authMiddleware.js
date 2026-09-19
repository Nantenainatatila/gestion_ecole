const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        //Recuperation de header 
        const authHeader = req.headers.authorization;
        ///verifie s'il existe
        
        if (!authHeader){
            return res.status(401).json({
                message:"Acces non autorisé"
            });
        } 
        //verifier le format : bearer TOKEN
        const parts = authHeader.split(" ");

        if(parts.length !== 2 || parts[0] !== "Bearer") {
            return console.log("format non valide");
        } 
        

        const token = parts[1];
        
        //verifier le token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        //stocker les information de l'utilsateur
        req.utilisateur = decoded;
        // Continuer vers la route
        next();
        
    } catch(error) {
        console.error("erreur de recuperation de token", error.message);
        return res.status(400).json({
            message: "token invalide ou expire"
        });
    }
};
module.exports = authMiddleware;