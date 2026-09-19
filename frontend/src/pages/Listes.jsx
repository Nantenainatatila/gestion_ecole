import { useEffect, useState  } from "react";
import "./Listes.css";
import { useNavigate } from "react-router-dom";
import { useAnnee } from "../context/AnneContext";
import api from "../api/axios";


function Listes(){
    const [students, setStudents] = useState([]);
    const { idAnnee } = useAnnee();
    const [ recherche, setRecherche ] = useState("") ;

   
    //Charger l'etudiant
    useEffect(()=> {
        const chargerStudents = async ()  => {
            if (!idAnnee) {
                setStudents([]);
                return;
            }
            try {
                const response = await api.get(`/students/${idAnnee}`);
                console.log("Donnees ok", response.data);
                setStudents(response.data);

            }catch (error) {
                console.error("erreur de recuperation", error);
            }
        };
        chargerStudents();
    }, [idAnnee]);
    //fonction suppression
    const supprimerEtudiant = async (id) => {
        const confirmation = window.confirm("Voulez-vous vraiment supprimer cet étudiant?");
        if (!confirmation) {
            return;
        }

        try {
            await api.delete(`/students/${id}`);
            alert("Etuduant suppreimé avec succès");
            setStudents(students.filter((student) => student.id_etudiant !== id));
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression");
        }
    };

    // modification
    const navigate = useNavigate();

     //recherche
     const etudiantFiltres = students.filter((student) => {
        const rechercheNormalisee = recherche.toLowerCase().trim();
            
            const nom = (student.nom || "").toLowerCase();
            const prenom = (student.prenom || "").toLowerCase();
            const nomComplet = `${nom}${prenom}`;
            const nomPrenom = `${nom}${prenom}`;
            return(
                nom.includes(rechercheNormalisee) ||
                prenom.includes(rechercheNormalisee) ||
                nomComplet.includes(rechercheNormalisee) ||
                nomPrenom.includes(rechercheNormalisee) 
                
            );
    });
  
    //return
    return(
        <div>
         
            <h2>Listes des étudiants</h2>
            {!idAnnee && (
                <p>
                    Veuiller selection une année scolaire
                </p>
            )}
            <div className="recherche">
                <input 
                    type="text"
                    placeholder="Rechercher..........................."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="search-input"
                />
                <br />
            </div>
            <div className="table-container">
            {idAnnee && (
            <table border="1">
                <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Nom et Prenom</th> 
                        
                        <th>Date et lieu de naissance</th>
                        <th>Mention</th>
                        <th>Niveau</th>
                        <th>Actions</th>
                 
                       
                    </tr>
                </thead>
                <tbody>
                    {etudiantFiltres.length > 0 ? (
                        etudiantFiltres.map((student) => (
                            <tr key={student.id_etudiant}>
                                <td><center>{student.matricule}</center></td>
                                <td>{student.nom} {student.prenom}</td>
                                
                                <td>
                                    {new
                                        Date(student.date_naissance).toLocaleDateString("fr-FR")
                                    } à  {student.lieu_naissance}
                                </td>
                                
                                <td>{student.nom_mention}</td>
                                <td><center>{student.niveau}</center></td>
                                <td>
                                    
                                    
                                    <button className="bouton-resultat" onClick={() => navigate("/etudiants") }>Ajouter</button>         
                                    <button className="bouton-resultat" onClick={() => 
                                        navigate(
                                            `/modifier_etudiant/${student.id_etudiant}`
                                        )
                                    }
                                    >
                                        Modifier
                                    </button>
                                    <button className="bouton-resultat1" onClick={() => supprimerEtudiant(student.id_etudiant)}>Supprimer</button>
                                </td>
            
                            </tr>
                        ))
                    ):(
                        <tr>
                            <td colSpan="7" style={{height: "40px"}} > <center>Aucun étudiant trouvé</center></td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
            )}
            </div>
        </div>
    );
}
export default Listes;