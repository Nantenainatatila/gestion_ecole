
import api from "../api/axios";
import { useEffect, useState } from "react";

function Matiere (){
    //Recuperation de mention
    const [mentions, setMentions] = useState([]);
    const [idMention, setIdMention] = useState("");
    const [modeModification, setModeModification] = useState(false);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        api.get("/mentions")
        .then((response) => {
            setMentions(response.data);
            if (response.data.length > 0) {
                setIdMention(response.data[0].id_mention);
            }
        })
        .catch ((error) => {
            console.log(error);
        })
    }, []);

    //Declaration de matiere
    const [matiere, setMatiere] = useState({
        nom_matiere:"",
        coefficient:""
    });
    const [matiere_mention, setMatiere_Mention] = useState({
        id_matiere:"",
        id_mention:""
        
    });
    //HandleChange pour la matiere
    const handleChangeMatiere = (e) => {
        setMatiere({
            ...matiere, [e.target.name]:e.target.value
        });
    }
    //HandleChange pour la mention
    const handleChangeMention = (e) => {
        setMatiere_Mention({
            ...matiere_mention, id_mention: Number(e.target.value)
        });
    }

    //Eviter l'absecence et les majuscules de nom de matiere
    const normaliserNom = (nom) => {
        return nom
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
    };

     //Affichage des matieres
     const [matiere_par_mention, setMatiere_par_Mention] = useState([]);
     const [refresh, setRefresh] = useState(0);

     const matieresFiltees = matiere_par_mention.filter((mat) => 
         Number(mat.id_mention) === Number(idMention));
 
     useEffect(() => {
         api.get("/matieres_par_mentions")
         .then((response) => {
             setMatiere_par_Mention(response.data);
         })
         .catch ((error) => {
             console.error(error);
         });
     }, [refresh]);

     //Modification
    const modifierMatiere = async (id) => {
        try {
            const response = await api.get(
                `/matieres/${id}`
                );
            setMatiere({
                id_matiere: response.data.id_matiere,
                nom_matiere: response.data.nom_matiere,
                coefficient: response.data.coefficient,
                id_mention: response.data.id_mention
            });
            setMatiere_Mention({
                id_matiere: response.data.id_matiere,
                id_mention: response.data.id_mention
            });
            
            setModeModification(true);
        } catch (error) {
            console.error("Erreur de recuperation de matiere", error);
        }
    };

    //Annuler la modification

    const annulerModification = () => {
        setMatiere({
            id_matiere:"",
            nom_matiere:"",
            coefficient:"",
            id_mention:""
        });
        setModeModification(false);
    };

    //HandleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur("");
        
        try {
            if (modeModification) {
                //Modification
                await api.put(
                    `/matieres_par_mentions/${matiere.id_matiere}`, {
                        nom_matiere: matiere.nom_matiere,
                        coefficient: matiere.coefficient,
                        id_mention: matiere_mention.id_mention
                    }
                );
                alert("Matiere modifié avec succès");
            } else {
                const nomNormaliser = normaliserNom(matiere.nom_matiere);
                if (!nomNormaliser) {
                    setErreur("Veuiller saisir le nom de la matiere");
                    return;
                }
                const responseGetMatieres = await api.get("/matieres");
                const matiereExiste = responseGetMatieres.data.find((mat) => 
                    mat.nom_matiere.trim().toLowerCase() === nomNormaliser.trim().toLowerCase() );

                const responseAssociations = await api.get("/mentions_matieres");
                if (matiereExiste) {
                    const existe = responseAssociations.data.some((association) => 
                        Number(association.id_matiere) === Number(matiereExiste.id_matiere) && 
                        Number(association.id_mention) === Number(matiere_mention.id_mention)
                    );
                    if (existe) {
                        setErreur("Cet matiere existe déja dans cette mention");
                        return;
                    }
                }
            
                const responsMatiere = await api.post("/matieres", matiere);
                const idMatiere = responsMatiere.data.id_matiere;
                const responseMatiere_Mention = await api.post("/mentions_matieres",
                    {
                        ...matiere_mention, id_matiere: idMatiere
                    }
                );
                console.log("Matiere ajoutée avec succès", responsMatiere.data);
                console.log("Matire avec mention ajoutée avec succès", responseMatiere_Mention.data);
                alert("Matiere ajoutée avec succès");
           
            }
            setRefresh(refresh + 1);
            setMatiere({
                nom_matiere:"",
                coefficient:""
            });
            setMatiere_Mention({
                id_matiere:"",
                id_mention:""
            });
            setModeModification(false);


        } catch(error){
            console.log("Erreurrrr:", error);
            setErreur("Il y a une erreur, veuiller reésseyer");
        }
    };

      //fonction suppression
      const supprimerMatiere = async (id) => {
        const confirmation = window.confirm("Voulez-vous vraiment supprimer cette matiere?");
        if (!confirmation) {
            return;
        }

        try {
            await api.delete(`/matieres/${id}`);
            alert("Matiere supprimée avec succès");
            setRefresh(refresh + 1);
        } catch (error) {
            console.error(error);
            setErreur("Erreur lors de la suppression");
        }
        
    };

   
    return(
        <>

        <div className="div-matiere">
            <h1>Ajouter une matiere</h1>
        {/* Ajout de matiere */}
        <div className="ajout-matiere">
            
        <form onSubmit={handleSubmit} className="form-matiere">
            
            <center><h2>
                {modeModification ? "Modification de la matiere" : "Ajouter une matiere"}</h2>
            <div className="form_group">
            <label htmlFor="">Matieere</label>
            <input 
                type="text"
                name="nom_matiere"
                value={matiere.nom_matiere}
                onChange={handleChangeMatiere}
                placeholder="Entrer un matiere"
                required/>
            </div>
            <div className="form_group">
            <label htmlFor="">Coefficient</label>
            <input 
                type="number"
                name="coefficient"
                value={matiere.coefficient}
                onChange={handleChangeMatiere}
                placeholder="Coefficient"
                max={6}
                min={1}
                required
            /> 
            </div>
            <div className="form_group">
            <label htmlFor="">Mention</label>
            <select 
                name="id_mention"
                value={matiere_mention.id_mention}
                onChange={handleChangeMention}
                required
            > 
                <option value="">--Choisir la mention--</option>
                {
                    mentions.map((mention)=> (
                        <option 
                            key={mention.id_mention}
                            value={mention.id_mention}
                            
                        >
                            {mention.nom_mention}
                        </option>
                    ))
                }
            </select>
            </div>
            
            <div>
                {erreur && (
                    <p className="message-erreur">{erreur}</p>
                )}
                <button type="submit">{modeModification ? "Enregistrer la modification" : "Enregistrer"}</button>
                {modeModification && (<button className="bouton-resultat1" type="bouton" onClick={annulerModification}>Annuler</button>)}
            </div>
            </center>
            
            
        </form>
        </div>
        {/* Listes des matieres ajoutées */}
        <div className="liste-matiere">
        
            <select 
                value={idMention}
                onChange={(e) => setIdMention(e.target.value)} 
            >
                <option value="">--Choisir une mention</option>

                {
                    mentions.map((mention) => (
                        <option 
                            key={mention.id_mention}
                            value={mention.id_mention}
                        >
                            {mention.nom_mention}
                        </option>
                    ))
                }
            </select>

            {idMention && (
                <div>
                   

                    {matieresFiltees.length === 0 ? (
                        <p>
                            Aucune matiere dans cette mention
                        </p>
                    ): (
                        <table>
                            <thead>
                                <tr>
                                    <th>Matiere</th>
                                    <th>Coefficient</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matieresFiltees.map((mat) => (
                                    <tr key={mat.id_matiere}>
                                        <td>{mat.nom_matiere}</td>
                                        <td>{mat.coefficient}</td>
                                        <td>
                                            <button className="bouton-liste" type="button" onClick={() => modifierMatiere(mat.id_matiere)}>Modifier</button>
                                            <button className="bouton-liste1" onClick={() => supprimerMatiere(mat.id_matiere)}>Supprimer</button>
                                            
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
        </div>
        </>
    );
}
export default Matiere;