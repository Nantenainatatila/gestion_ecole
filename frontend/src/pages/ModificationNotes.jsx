import { useEffect, useState } from "react";
import api from "../api/axios";

import { useNavigate, useParams, useLocation } from "react-router-dom";
function ModificationNotes() {
    const { idInscription } = useParams();                         
    const navigate = useNavigate();
    const [matieres, setMatieres] = useState([]);
    const [enregistrer, seetEnregistrer] = useState(false);
    const location = useLocation();
    const { idTypeExamen, idAnnee, idMention, idNiveau  } = location.state || {} ;

    useEffect(() => {
        const chargerNotes = async() => {
            try {
                
                const response = await api.get(
                    `/notes/inscription/${idInscription}`,
                    {
                        params: {
                            id_type_examen: Number(idTypeExamen)
                        }
                    }
                );
                
                setMatieres(response.data);

                
            } catch (error) {
                console.error("erreur de chargement de note", error);
            }
            
        };
        if (idInscription && idTypeExamen) {
            chargerNotes();
        }
    }, [idInscription, idTypeExamen]);
    
    //Handle note change
    const handleChange = ( e, idMatiere ) => {
        const valeur = e.target.value;

        setMatieres(prev => 
            prev.map(matiere => 
                matiere.id_matiere === idMatiere
                    ?{
                        ...matiere,
                        note: valeur
                    }
                    : matiere
            )
        );
    };
    //Bouton enregistrer

    const enregistrerModification = async () => {
       if (enregistrer) return;
       seetEnregistrer(true); 
       try {
            for (const matiere of matieres){
                const valeur = Number(matiere.note);
                if ( valeur < 0 || valeur > 20) {
                    alert ("Les notes doit etre compris entre 0 et 20");
                    return;
                }
            }
            const notesAEnvoyer = matieres
                .filter(matiere => 
                    matiere.note !== null &&
                    matiere.note !== undefined &&
                    matiere.note !== ""
                    
                )
                .map(matiere => ({
                    id_inscription: Number(idInscription),
                    id_type_examen: Number(idTypeExamen),
                    id_matiere: Number(matiere.id_matiere),
                    note: Number(matiere.note)
                }));

                if (notesAEnvoyer.length === 0) {
                    alert("Aucune note à envoyer");
                    return;
                }
                //console.log("ote a envoyer:", notesAEnvoyer);
                await Promise.all(notesAEnvoyer.map(note => 
                    api.post("/notes/modifier", note)
                ));
                alert("Les notes on été modifié avec succès");
                
                navigate("/resultat", {
                    state: {
                        idAnnee, idMention, idNiveau, idTypeExamen
                    }});
       } catch (error) {
            console.error("erreur de modofocation", error);
            console.log("erreur eto ", error);
       } finally {
        seetEnregistrer(false);
       }
        
    };
    

    return(
        <div>
            <center>
             <h1>
                        Modification des notes  
             </h1>
             </center>
            {matieres.map((matiere) => (
                <div key={matiere.id_matiere} className="form_group">
                   
                    <label>
                        {matiere.nom_matiere} {" "} (coeff:{matiere.coefficient})<span> /20</span>
                    </label>
                    <input 
                        required
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        value={matiere.note ?? ""}
                        onChange={(e) => 
                            handleChange(e, matiere.id_matiere)
                        }
                        
                    />
                    
                </div>
                
            ))}
            <center>
            <button onClick={enregistrerModification} disabled={enregistrer} >{enregistrer ? "Enregistrement..." : "Enregistrer la modification"}</button>
            <button onClick={() => navigate("/resultat", {
                    state: {
                        idAnnee, idMention, idNiveau, idTypeExamen
                    }})} 
                    className="bouton-resultat1"
            >
                Annuler
            </button>
            </center>
        </div>
    );
}
export default ModificationNotes;