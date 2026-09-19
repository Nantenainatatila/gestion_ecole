
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErreur("");

        if (!email || !password) {
            setErreur("Veuiller remplir tous les champs");
            return;
        }
        try {
            const response = await api.post(
                `/users/login`, 
                {
                    email: email,
                    mot_de_passe: password
                }
            );
            //stocker le JWT
            localStorage.setItem("token", response.data.token);
            console.log("token:", response.data.token);
            //Stocker les information de l'utilisateur
            localStorage.setItem("utilisateur", JSON.stringify(response.data.utilisateur));
            console.log("utilisateur:", response.data.utilisateur);

            navigate("/dashoard");
        } catch (error) {
            console.error("erreur de connexion", error);
            setErreur(
                error.response?.data.message || "Erreur lors de la connexion"
            );
        }
    };
    return(
        <div>
            <div className="form_login">

            
            <center><h1>Login</h1></center>
            
            <form onSubmit={handleSubmit}>
                <div className="form_group">
                    <label htmlFor="">Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                 <div className="form_group">
                    <label htmlFor="">Mot de passe</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                 </div>

                 <br />
                 <div>
                    <center>
                        {erreur && (
                            <p className="message-erreur">{erreur}</p>
                        )}
                        <button className="action" type="submit">Se connecter</button>
                        <p>Vous n'avez pas encore de compte?  
                            <button className="bouton_connexion" onClick={() => navigate("/creation")}>Creer un compte</button> 
                        </p>
                    </center>
                        
                 </div>
                
            </form>
            </div>
           
            
        </div>
    );
}
export default Login;