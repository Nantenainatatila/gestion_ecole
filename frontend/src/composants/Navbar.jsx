import { NavLink, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { useAnnee } from "../context/AnneContext";
import "./Navbar.css";
import api from "../api/axios";

function Navbar(){
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));
    

    const navigate = useNavigate();
    const [annees, setAnnees] = useState([]);
    const {idAnnee, changerAnnee} = useAnnee();
    const [menuOuvert, setMenuOuvert] = useState(false);
    const fermerMenue = () => {
        setMenuOuvert(false);
    };

    useEffect(() => {
        const chargerAnnees = async () => {
            try {
                const response = await api.get("/annees");
                setAnnees(response.data);
            } catch (error) {
                console.error("erreur de rec anne navbar", error);
            }
        };
        chargerAnnees();
        
    }, []);

    //deconnexion
    const deconnexion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("utilisateur");
        navigate("/login");
    }

    return(
        <>
        <button
            className="menu-toggle"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Ouvrir le menu"
        >
                {menuOuvert ? "✕" : "☰ "}
            </button>
        <nav className={`navbar ${menuOuvert ? "ouvert" : ""}`}> <br /> <br /> <br />
            <p>Bonjour {utilisateur?.name_user}</p>
            <h2 className="titre">Gestion école</h2>
            <h4>Année universitaire</h4>
             <select 
                value={idAnnee}
                className="select-nav"
                onChange={(e) => changerAnnee(e.target.value)}
            >
                {annees.map((annee) => (
                    <option 
                        key={annee.id_annee}
                        value={annee.id_annee}
                    >
                        {annee.annee}
                    </option>
                ))}
                
            </select>
            
            <NavLink to="/dashoard"  className="nav_links" onClick={fermerMenue}>Dashboard</NavLink>
            <NavLink to="/resultat" className="nav_links" onClick={fermerMenue}>Resultat</NavLink>
            <NavLink to="/listes" className="nav_links" onClick={fermerMenue}>Listes des étudiants</NavLink>
            <NavLink to="/notes" className="nav_links" onClick={fermerMenue}>Nouveau notes</NavLink>
            <NavLink to="/etudiants" className="nav_links" onClick={fermerMenue}>Nouveau étudiant</NavLink>
            <NavLink to="/matiere" className="nav_links" onClick={fermerMenue}>Nouveau Matiere</NavLink>
            
            <button onClick={deconnexion} style={{color:'red'}} className="bouton" >Deconnexion</button>
      
           
        </nav>
        </>
    );
}
export default Navbar;