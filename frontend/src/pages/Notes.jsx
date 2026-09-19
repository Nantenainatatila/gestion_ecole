import { useEffect, useState } from "react";
import { useAnnee } from "../context/AnneContext";
import api from "../api/axios";

function Notes(){
    //Données
    const [mentions, setMentions] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [typesExamen, setTypesExamen] = useState([]);

    const [students, setStudents] = useState([]);
    const [matieres, setMatieres] = useState([]);

    //Selections
    const { idAnnee } = useAnnee();
    const [idMention, setIdMention] = useState("");
    const [idNiveau, setIdNiveau] = useState("");
    const [idTypeExamen, setIdTypeExamen] = useState("");

    const [idInscription, setIdInscription] = useState("");

    const [notes, setNotes] = useState("");
    const [erreur, setErreur] = useState("");

    
   //CHARGER LES MENTION
   useEffect(() => {
    const chargerMention = async () => {
        try {
            const response = await api.get("/mentions");
            setMentions(response.data);
        } catch (error) {
            console.error("erreur mention", error);
        }
    };
    chargerMention();
   }, []);

   //CHARGER NIVEAUX
   useEffect(() => {
    const chargerNiveaux = async () => {
        try {
            const response = await api.get("/niveaux");
            setNiveaux(response.data);
        } catch (error) {
            console.error('erreur niveaux', error);
        }
    };
    chargerNiveaux();
   },[]);

   //CHARGER TYPES D'EXAMEN

   useEffect(() => {
    const chargerTypesExamen = async () => {
        try {
            const response = await api.get("/types_examen");

            setTypesExamen(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("erreur type d'examen",error);
        }
    };
    chargerTypesExamen();
   },[]);


   //CHANGER MENTION
   const handleMentionChange = async (e) => {
        const valeur = e.target.value;
        setIdMention(valeur);

        setIdNiveau("");
        setIdInscription("");

        setStudents([]);
        setNotes([]);

        if (!valeur) {
            setMatieres([]);
            return;
        }
        try {
            const result = await api.get(
                `/note_mention?id_mention=${valeur}`
            );
            setMatieres(result.data);
        } catch (error) {
            console.error("erreur rec matiere", error);
            setMatieres([]);
        }
   };

   //CHANGER NIVEAU
   useEffect(() => {
        if (!idAnnee || !idMention || !idNiveau ) {
            setStudents([]);
            return;
        }
        // ATO ATO

        const chargerEtudiants = async () => {
            try {
                const response = await api.get(
                    `/note_student?id_annee=${idAnnee}&id_mention=${idMention}&id_niveau=${idNiveau}`
                );
                setStudents(response.data);
                
            } catch (error) {
                console.error(error);
            }
        };
        chargerEtudiants();
   }, [idAnnee, idMention, idNiveau]);

   const handleNiveauChange = async (e) => {
        const valeur = e.target.value;
        setIdNiveau(valeur);

        setIdInscription("");
        setStudents([]);
        setNotes([]);

        if (!valeur || !idAnnee || !idMention) {
            setStudents([]);
            return;
        }
        try {
            const result = await api.get(
                `/note_student?id_annee=${idAnnee}&id_mention=${idMention}&id_niveau=${valeur}`
            );
            setStudents(result.data);
        } catch (error) {
            console.error ("erreur req etudiant par annee, mention ,niveau", error);
            setStudents([]);
        }
   };

   //CHANGER ETUDIANT
   const handleEtudiantChange = (e) => {
        setIdInscription(e.target.value);
        setNotes({});
   };

   //CHANGER UNE NOTE
   const handleNoteChange = (idMatiere, valeur) => {
        setNotes((ancien) => ({
            ...ancien, [idMatiere]: valeur
        }));
   };
   //ENREGISTRER LES NOTES

   const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur("");
        if (!idInscription) {
            setErreur("Veuiller choisir l'étudiant");
            return;
        }
        if (!idTypeExamen) {
            setErreur("Veuiller choisir le type d'examen");
            return;
        }
        for (const matiere of matieres) {
            const valeur = notes[matiere.id_matiere];

            if (valeur === undefined || valeur === "") {
                setErreur(`Veuiller saisir la note de ${matiere.nom_matiere}`);
                return;
            }
            if (Number(valeur) < 0 || Number(valeur) > 20 ) {
                setErreur(`La note de ${matiere.nom_matiere} doit etre entre 0 et 20`);
                return;
            }
        }
        //construiction de liste de note
        const listeNotes = matieres.map((matiere) => ({
            id_inscription: Number(idInscription),
            id_matiere: matiere.id_matiere,
            id_type_examen: Number(idTypeExamen),
            note: Number(notes[matiere.id_matiere])
        }));

        try {
            console.log("notes envoyées", listeNotes);
            await api.post("/notes", listeNotes);
            alert("Notes enregistrées avec succès");

            setIdInscription("");
            setNotes({});
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                setErreur(error.response.data.message);
            }else {
                setErreur("erreur survenue")
            }
            
        }
   };
    return(
        <div>
            <h1>Saisi des notes</h1>
        <div className="note-container">
            <center><h2>Choisir l'étudiant</h2></center>
            {idAnnee && (
            <form action="" onSubmit={handleSubmit}>
                

                {/**MENTION */}
            
                <div className="form_group">
                    <label htmlFor="">Mention</label>
                    <select 
                        value={idMention}
                        onChange={handleMentionChange}
                        disabled={!idAnnee}
                        
                    >
                        <option value="">--Choisir une mention--</option>

                        {mentions.map((mention) => (
                            <option 
                                key={mention.id_mention}
                                value={mention.id_mention}
                            >
                                {mention.nom_mention}
                            </option>
                        ))}
                    </select>
                </div>
                {/**NIVEAU */}
                <div className="form_group">
                    <label htmlFor="">Nieveau</label>
                    <select 
                        value={idNiveau}
                        onChange={handleNiveauChange}
                        
                        disabled={!idMention}
                    >
                        <option value="">--Choisir un niveau--</option>
                        {niveaux.map((niveau) => (
                            <option 
                                key={niveau.id_niveau}
                                value={niveau.id_niveau}
                            >
                                {niveau.niveau}
                            </option>
                        ))}
                    </select>
                </div>
                {/**type d'examen */}
                <div className="form_group">
                    <label htmlFor="">Type d'examen</label>
                    <select 
                        value={idTypeExamen}
                        onChange={(e) => setIdTypeExamen(e.target.value)}
                        
                        disabled={!idNiveau}
                    >
                        <option value="">--Choisir le type d'examen</option>
                        {typesExamen.map((type) => (
                            <option 
                                key={type.id_type_examen}
                                value={type.id_type_examen}
                            >
                                {type.type_examen}
                            </option>
                        ))}
                    </select>
                </div>
                {/**ETUDIANT */}
                <div className="form_group">
                    <label htmlFor="">Etudiant</label>
                    <select 
                        value={idInscription}
                        onChange={handleEtudiantChange}
                        required
                        disabled={!idNiveau || students.length === 0}
                    >
                        <option value="">--Choisir un étudiant</option>
                        {students.map((student) => (
                            <option 
                                key={student.id_inscription}
                                value={student.id_inscription}
                            >
                                {student.nom} {" "} {student.prenom}
                            </option>
                        ))}
                    </select>
                     </div>
                     <center>
                        {erreur && (
                            <p className="message-erreur">{erreur}</p>
                        )}
                        {idNiveau && students.length === 0 &&  (
                            <p>
                            Aucun étudiant trouvé pour cette selection
                            </p>

                        )}
                        {idMention && matieres.length === 0 &&(
                            <p>
                                Aucune matiere pour cette mention
                            </p>
                        )}
                     </center>
               

                {/**MATIERES */}

                {students.length > 0  && matieres.length > 0 && (
                    <div className="matieres">
                        <h3>Saise des notes</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Matieres</th>
                                    <th>Coefficient</th>
                                    <th>Note / 20</th>
                                </tr>
                                
                            </thead>

                            <tbody>
                                {matieres.map((matiere) => (
                                    <tr key={matiere.id_matiere}>
                                        <td>{matiere.nom_matiere}</td>
                                        <td>{matiere.coefficient}</td>
                                        <td>
                                            <input 
                                                className="input_note"
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.01"
                                                placeholder="Entrer ici la note"
                                                value={notes[matiere.id_matiere] ?? ""}
                                                onChange={(e) => handleNoteChange(matiere.id_matiere,e.target.value)}
                                                required
                                            />
                                            
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
        
                            
                            
                        </table>
                        <center>
                            <button className="bouton_form_group" type="submit">Enregistrer les notes</button>
                        </center>
                    </div>
                )}
            
            </form>
          )}
        </div>
        </div>
    );
}
export default Notes;