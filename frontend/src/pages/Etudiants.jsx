import { useState, useEffect } from "react";
import "./Etudiant.css";
import { useParams,useNavigate } from "react-router-dom";
import { useAnnee } from "../context/AnneContext";
import api from "../api/axios";

function Etudiants() {
    //Annee
    const { idAnnee } = useAnnee();
    //Mentions
    const [mentions, setMentions] = useState([]);
    useEffect(() => {
        api.get("/mentions")
        .then((response) => {
            setMentions(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, []);

    //niveaux
    const [niveaux, setNiveaux] = useState([]);
    useEffect(() => {
        api.get("/niveaux")
        .then((response) => {
            setNiveaux(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, []);



    //Etudiant

    const navigate = useNavigate();
    const { id } = useParams();
    const modeModification = Boolean(id);
    const [student, setStudent] = useState({
        nom:"",
        prenom:"",
        adresse:"",
        date_naissance:"",
        telephone:"",
        lieu_naissance:""
    });

    //Inscription
    const [inscription, setInscription] = useState({
        id_inscription:"",
        id_etudiant:"",
        id_niveau:"",
        id_mention:""

    });

    useEffect(() => {
        if (!modeModification) return;
        const chargerDonnees = async () => {
            try {
                const responseStudentId = await api.get(
                    `/students/etudiant/${id}`
                );
                setStudent(responseStudentId.data);
                console.log("etu:", responseStudentId.data);

                const responseInscriptionId = await api.get(
                    `/inscriptions/etudiant/${id}`
                );
                console.log("ins:", responseInscriptionId.data);
                setInscription(responseInscriptionId.data);
                
            } catch (error) {
                console.error(
                    "erreur de recuperation:", error
                );
            }
        };
        chargerDonnees();
    }, [id, modeModification]);

    const handleStudentChange = (e) => {
        setStudent({
            ...student, [e.target.name]:e.target.value
        });
    }
    const handleInscriptionChange = (e) => {
         setInscription({
            ...inscription, [e.target.name]: e.target.value
        });
    } 
    
    
    
    
    //function pour le bouton
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (modeModification) {
                const donnees = {
                    nom: student.nom,
                    prenom : student.prenom,
                    adresse: student.adresse,
                    date_naissance: student.date_naissance,
                    telephone: student.telephone,
                    lieu_naissance: student.lieu_naissance,

                    id_inscription: inscription.id_inscription,
                    id_annee: Number(idAnnee),
                    id_mention: inscription.id_mention,
                    id_niveau: inscription.id_niveau
                };
                //Modification 
                const responseModifier = await api.put(
                    `/students/${id}`, donnees
                );
                console.log("Modifié", responseModifier.data);
                if(responseModifier){
                    alert("Etudient modifié avec succès");
                }
                
                navigate("/listes");
            } else {
                const response = await api.get("/students");
                const existe = response.data.some((etudiant) => 
                    etudiant.nom.trim().toLowerCase() === student.nom.trim().toLowerCase() && 
                    etudiant.prenom.trim().toLowerCase() === student.prenom.trim().toLowerCase() 
                );
                if (existe) {
                    alert("Cet étudiant existe déja");
                    return;
                }
                const responseStudent = await api.post("/students",student);
                const idEtudiant = responseStudent.data.id_etudiant;
                const responseInscription = await api.post("/inscriptions",
                    {
                    ...inscription, 
                    id_etudiant:idEtudiant,
                    id_annee: Number(idAnnee)
                    }
                );
                
                alert("Etudiant enregistré evec succès");
                navigate("/listes");
                setStudent({
                    nom:"",
                    prenom:"",
                    adresse:"",
                    date_naissance:"",
                    telephone:"",
                    lieu_naissance:""
                });
                setInscription({
                    id_etudiant:"",
                    id_niveau:"",
                    id_mention:""
                });
                }
            
           
        }catch(error){
            console.log("Erreurrrr:", error);
            alert("Il y a une erreur, veuiller reésseyer");
        }
    };

   
    //Interface 

    return(
       <form action="" onSubmit={handleSubmit}>
            <h1>
                Nouveau étudiant
            </h1>
            <div className="container">
               
                    <center>
                    
                        <h3>
                            {modeModification
                                ? "Modifier un etudiant"
                                :  "Ajouter étudiant" 
                            }
                        </h3>
                    </center>
                    
                    <div className="form_group">
                        <label htmlFor="">Nom:</label>
                        <input 
                            type="text" 
                            name="nom"
                            placeholder="ex:NANTENAINA"
                            value={student.nom}
                            onChange={handleStudentChange}
                            required
                        /> 
                    </div>

                    <div className="form_group">
                        <label htmlFor="">Prenom:</label> 
                        <input 
                            type="text" 
                            name="prenom"
                            placeholder="ex:Tatila"
                            value={student.prenom}
                            onChange={handleStudentChange}
                        /> 
                    </div>

                    <div className="form_group">
                        <label htmlFor="">Adresse actuelle</label>
                        <input 
                            type="text" 
                            name="adresse"
                            placeholder="ex: Manantenasoa"
                             value={student.adresse}
                            onChange={handleStudentChange}
                            required
                        /> 
                    </div>

                    <div className="form_group">
                        <label htmlFor="">Date de naissance:</label> 
                        <input 
                            type="date" 
                            name="date_naissance"
                            placeholder="Date de naissance"
                            value={student.date_naissance ?new Date(student.date_naissance).toISOString().split("T")[0] : ""}
                            onChange={handleStudentChange}
                            required
                        /> 
                    </div>

                    <div className="form_group">
                        <label htmlFor="">Lieu de naissance</label> 
                        <input 
                            type="text"
                            name="lieu_naissance"
                            placeholder="Lieu de naissance"
                            value={student.lieu_naissance}
                            onChange={handleStudentChange}
                            required
                        />
                    </div>
                
                    <div className="form_group">
                        <label htmlFor="">Téléphone:</label> 
                            <   input 
                            type="tel" 
                            name="telephone"
                            placeholder="ex:03XXXXXXXX"
                            pattern="03[0-9]{8}"
                            maxLength={10}
                            value={student.telephone}
                            onChange={handleStudentChange}
                            required
                            /> 
                    </div>
                    
                    <div className="form_group">
                        <label htmlFor="">Mention:</label> 

                        <select 
                            name="id_mention" 
                            value={inscription.id_mention}
                            onChange={handleInscriptionChange}
                        required
                        >
                            <option value="">--Choisir une mention--</option>

                            {
                                mentions.map((mention)=>(
                                    <option  key={mention.id_mention} 
                                    value={mention.id_mention}>
                                        {mention.nom_mention}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    
                    <div className="form_group">
                        <label htmlFor="">Niveau:</label>
                        <select 
                            name="id_niveau" 
                            value={inscription.id_niveau}
                            onChange={handleInscriptionChange}
                            required
                        >
                            <option value="">--Choisir un niveau--</option>
                            {
                                niveaux.map((niveau) => (
                                    <option value={niveau.id_niveau}
                                    key={niveau.id_niveau}>
                                        {niveau.niveau}
                                    </option>
                                ))
                            }

                        </select>
                    </div>
                    
            
                    <div>
                        <center>
                        <button type="submit" className="bouton-enregistre">{modeModification ? " Enregistrer la modification" : "Enregistrer"}</button>
        
                        {modeModification && (
                            <button type="button" className="bouton-resultat1" onClick={() =>  navigate("/listes")}>Annuler</button>
                        )}
                        </center>
                    </div>
                   
            </div> 
       </form>
    );
}
export default Etudiants;