import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";


function Creer() {
    const navigate = useNavigate();
    const [name_user, setNameUsers] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [erreur, setErreur] = useState("")
   
    const handleSubmit = async(e) => {
        e.preventDefault();
        setErreur("");

        if (!name_user || !email || !password || !confirm_password || !role) {
            setErreur("Veuiller remplir tous les champs");
            return;
        }
        try {
            const response = await api.get("/users");
            const existe = response.data.some((user) => user.email.trim().toLowerCase() === email.trim().toLowerCase());
            if (existe) {
                alert("Cet email existe déja");
                return;
            }
            if (!name_user || !email || !password || !confirm_password || !role) {
                alert("Tous les champs dont obligatoires");
                return;
            }
            if (confirm_password !== password) {
                alert ("Les deux mot de passe sont differents");
                return;
            }
            
            await api.post(
                `/users`, 
                    {
                        name_user: name_user,
                        email: email,
                        mot_de_passe: password,
                        role: role
                    }
            );
            alert(`L'utilisateur ${name_user} a été creé avec succès`);
            navigate('/login');
        } catch (error) {
            console.error("errer front de creation d'utilisateur", error);
            alert("non enregistre");  
        }
    };
    return(
        <div>
            <div className="form_creation">
            <form onSubmit={handleSubmit}>
                <center><h1>Creation de compte</h1></center>
                <div className="form_group">
                    <label htmlFor="">Nom d'utilisateur</label>
                    <input 
                        type="text"
                        value={name_user}
                        onChange={(e) => setNameUsers(e.target.value)}
                    />
                </div>
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
                 <div className="form_group">
                    <label htmlFor="">Confirmé le mot de passe</label>
                    <input 
                        type="password"
                        value={confirm_password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                  
                    />
                 </div>
                <div className="form_group">
                    <label htmlFor="">Role</label>
                    <select  value={role}  onChange={(e) => setRole(e.target.value)} >
                        <option value="">--Choisir le role</option>
                        <option value="admin">Administrateur</option>
                        <option value="coordo">Coordonnateur</option>
                        <option value="enseignant">Enseignant(e)</option>
                    </select> 
                </div>

                <br />
                
                
                <div>
                    <center>
                        {erreur && (
                            <p className="message-erreur">{erreur}</p>
                        )}
                        <button className="action" type="submit">
                            Creer un compte
                        </button>
                        <p>Vous avez deja un compte? 
                            <button className="bouton_connexion" onClick={() => navigate('/login')}>Se connecter
                        </button></p>
                    </center>
                     
                </div>
               
            </form>
            </div>
        </div>
    );
}
export default Creer;