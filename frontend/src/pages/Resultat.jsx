import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAnnee } from "../context/AnneContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function Resultat () {
    const navigate = useNavigate();
    const location = useLocation();
    const { idAnnee } = useAnnee(location.state?.idAnnee || 1);
    const [mentions, setMentions] = useState([]);
    const [niveaux, setNiveaux ] = useState([]);
    const [types_examens, setTypes_Examens] = useState([]);
    const [idMention, setIdMention] = useState(location.state?.idMention || 1);
    const [idNiveau, setIdNiveau ] = useState(location.state?.idNiveau || 3);
    const [idTypeExamen, setIdTypeExamen ] = useState(location.state?.idTypeExamen || 4);
    const [resultats, setResultats ] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [recherche, setRecherche ] = useState("");
    
//recherche

    const resultatFiltres = resultats.filter((etudiant) => {
        const rechercheNormalisee = recherche.toLowerCase().trim();

        const nom = (etudiant.nom || "").toLowerCase();
        const prenom = (etudiant.prenom || "").toLowerCase();
        const nomComplet = `${nom}${prenom}`; 
        const prenomNom = `${prenom}${nom}`;

        return (
            nom.includes(rechercheNormalisee) ||
            prenom.includes(rechercheNormalisee) ||
            nomComplet.includes(rechercheNormalisee) ||
            prenomNom.includes(rechercheNormalisee)
        );
    });
//CHARGER MENTION
    useEffect(() => {
        const chargerMention = async () => {
            try {
                const response = await api.get("/mentions");
                setMentions(response.data);
            } catch (error) {
                console.log("erreur mention", error);
            }
        };
        chargerMention();
    }, []);
//CHARGER NIVEAU

    useEffect(() => {
        const chargerNiveaux = async () => {
            try {
                const response = await api.get("/niveaux");
                setNiveaux(response.data);
            } catch (error) {
                console.error("erreur niveaux", error);
            }
        };
        chargerNiveaux();
    }, []);
//CHARGER TYPE D'EXAMEN

    useEffect(() => {
        const chargerTypesExamen = async () => {
            try {
                const response = await api.get("/types_examen");
                setTypes_Examens(response.data);
            } catch (error) {
                console.log("erreur type exame", error);
            }
        };
        chargerTypesExamen();
    }, []);


//CHARGEMENT DE RESULTAT

    useEffect(() => {
        if (!idAnnee || !idMention || !idNiveau || !idTypeExamen) {
            setResultats([]);
            return;

        }
        const chargerResultat = async () => {
            try {
                const response = await api.get(
                    `/resultats/resultat?id_annee=${idAnnee}&id_mention=${idMention}&id_niveau=${idNiveau}&id_type_examen=${idTypeExamen}`
                );
                setResultats(response.data.resultats);
                setMatieres(response.data.matieres);
            } catch (error) {
                console.error("Erreur de recuperation de resulta", error);
                setResultats([]);
            }
        };
        chargerResultat();
    }, [idAnnee,idMention, idNiveau, idTypeExamen]);

//Modification
    const modifierNotes = (etudiant) => {
        navigate(
            `/notes/modifier/${etudiant.id_inscription}`,{
                state: {
                    idTypeExamen,
                    idAnnee,
                    idMention,
                    idNiveau
                }
            }
        );
    };

//Suppression de note
    const supprimerNotes = async (idInscription, idTypeExamen) => {
        const confirmation = window.confirm("Vouler-vous supprimer les notes de cette étudiant ?");
        if (!confirmation) {
            return;
        }
        try {
            if (!Number.isInteger(Number(idInscription)) || !Number.isInteger(Number(idTypeExamen))) {
                alert("ID non validé");
                return;
            }
            await api.delete(
                `/notes/${Number(idInscription)}/${Number(idTypeExamen)}`
            );
            alert("Notes supprimées avec succès");
            setResultats(resultats.filter((student) => student.id_inscription !== idInscription ));
        } catch (error) {
            console.error("erreur de suppression", error.response?.data || error);
        }
    };
    //Exporter le resultat en PDF
    const exporterListesPDF = async () => {
        if (!idAnnee || !idMention|| !idNiveau || !idTypeExamen) {
            alert("Année, mention, niveau, type d'examen obligatoire");
            return;
        }

        try {
            const response = await api.get(
                `/resultats/resultat?id_annee=${idAnnee}&id_mention=${idMention}&id_niveau=${idNiveau}&id_type_examen=${idTypeExamen}`,
                [idAnnee, idMention, idNiveau, idTypeExamen]
            );
            const data = response.data;
            //console
            console.log("tout données", data);

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(
                "UNIVERSITE SAINT VINCENT DE PAUL AKAMASOA",
                105,
                20,
                {align:"center"}
            );
            doc.setFontSize(14);
            doc.text(
                `RESULTAT D'EXAMEN DE ${data.resultats[0].type_examen} ANNEE UNNIVERSITAIRE ${data.resultats[0].annee}`,
                105,
                30,
                {align:"center"}
            );
            doc.setFontSize(13);
            doc.text(
                `Mention: ${data.resultats[0].mention}`,
                20,
                38
            
            );
            doc.text(
                `Niveau: ${data.resultats[0].niveau}`,
                20,
                46
            );
            //tableau
            autoTable(doc, {
                startY: 50,
                head: [
                    [
                        "Rang",
                        "Matricule",
                        "Nom et Prenom",
                        "Moyenne /20",
                        "Observation"
                    ]
                ],
                body: data.resultats.map(student  => [
                    student.rang,
                    student.matricule,
                    `${student.nom} ${student.prenom}`,
                    `${Number(student.moyenne).toFixed(2)} /20`,
                    student.observation
                ])
            })

            doc.save(
                `RESULTAT EXAMEN DE ${data.resultats[0].type_examen} ${data.resultats[0].annee}.pdf`
            );

        } catch (error) {
            console.error("ereur de recuperation de resultat pour le PDF liste", error);
        }
    };

    ///Exportation en PDF

    const exporterPDF = async (idInscription, idTypeExamen ) => {
        try {
            const response = await api.get(
                `/notes/releve/${idInscription}`,
                {
                    params: {
                        id_type_examen: Number(idTypeExamen)
                    }
                }
            );
           
            const data = response.data; 
            
            const doc = new jsPDF();

            //  titre

            doc.setFontSize(16);
            doc.text(
                "UNIVERSITE SAINT VINCENT DE PAUL AKAMASOA",
                105,
                20,
                {align:"center"}
            );
            doc.setFontSize(15);
            doc.text(`
                RELEVE DE NOTES D'EXAMEN DE ${data.etudiant.type_examen}`,                                                          
                105,
                22,
                {align:"center"}
            );
            doc.text(`
                Année universitaire: ${data.etudiant.annee}`,
                100,
                32,
                {align:"center"}
            );
            


            //Information étudiant

            doc.setFontSize(11);
            doc.text(
                `Matricule: ${data.etudiant.matricule}`,
                20,
                45
            );
            doc.text(
                `Nom: ${data.etudiant.nom}`,
                20,
                52
            );
            doc.text(
                `Prenom: ${data.etudiant.prenom}`,
                20,
                59
            );
            doc.text(
                `Date et lieu de naissance: ${new Date(data.etudiant.date_naissance).toLocaleDateString("fr-FR")} à ${data.etudiant.lieu_naissance}`,
                20,
                66
            );
            doc.text(
                `Parcours: ${data.etudiant.mention}`,
                20,
                73
            );
            doc.text(
                `Niveau: ${data.etudiant.niveau}`,
                20,
                80
            );

           

            //Tableau

            autoTable(doc, {
                startY: 92,

                head: [
                    [
                        "Matiere",
                        "Coeffient",
                        "Note /20"
                    ]
                ], 
                
                body: [
                    ...data.etudiant.matieres.map(
                    matiere => [
                        matiere.nom_matiere,
                        matiere.coefficient,
                        `${matiere.note} /20`
                    ]),
                    [
                        "TOTAL",
                        data.etudiant.totalCoefficient,
                        `${data.etudiant.totale}/ ${data.etudiant.totalBut}`
                    ]
                ]
            });

            // resultats

            const position = doc.lastAutoTable.finalY + 15;

        
            doc.text(
                `Moyenne: ${data.etudiant.moyenne.toFixed(2)}/20`,
                20,
                position + 8
            );
            doc.text(
                `Observation: ${data.etudiant.observation}`,
                20,
                position + 16
            );
            doc.text(
                `Mention: ${data.etudiant.mention2}`,
                20,
                position + 32
            );
            doc.text(
                "Le Directeur",
                60,
                position + 64
            );
            doc.text(
                "Le Coordonnateur",
                140,
                position + 64
            );
            
            
            // telechargement

            doc.save(
                `Relevé des notes_${data.etudiant.matricule}.pdf`
            );

          


        } catch (error) {
            console.error("erreur d'exportation pdf", error);
        }
    };
    return (
        <>
            <h1>Resulat</h1>
            
            <select
                value={idMention}
                onChange={(e) => {
                    setIdMention(e.target.value);
                    setResultats([]);
                }} 
                required
               
            >
                <option value="">--Choisir la mention--</option>
                {mentions.map((mention) => (
                    <option 
                        key={mention.id_mention}
                        value={mention.id_mention}
                    >
                        {mention.nom_mention}
                    </option>
                ))}
            </select>
            <select
                value={idNiveau}
                onChange={(e) => {
                    setIdNiveau(e.target.value);
                    setResultats([]);
                }}
                required
                
            >
                <option value="">--Choisir le niveau--</option>
                {niveaux.map((niveau) => (
                    <option 
                        key={niveau.id_niveau}
                        value={niveau.id_niveau}
                    >
                        {niveau.niveau}
                    </option>
                ))}
            </select>
            
            <select 
                value={idTypeExamen}
                onChange={(e) => { setIdTypeExamen(e.target.value); setResultats([]); }} 
                required

            >
                    <option value="">--Choisir le type d'examen--</option>
                    {types_examens.map((type) => (
                        <option 
                            key={type.id_type_examen}
                            value={type.id_type_examen}
                        >
                            {type.type_examen}
                        </option>
                    ))}
            </select>

            {idAnnee && idMention && idNiveau && idTypeExamen && (
                <div>
                <button onClick={exporterListesPDF} className="bouton-enregistrer">Exporter la liste en PDF</button>
                <br />
                <input 
                    type="text"
                    placeholder="Recherche par le om et le prenom"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="search-input"
                />
                
                <h1>Resultat d'examen 
                    
                </h1>
                <table>
                    <thead>
                        <tr>
                            <th>Rang</th>
                            <th>Nom et prenom</th>
                            {matieres.map((matiere) => (
                                <th key={matiere.id_matiere}>
                                    {matiere.nom_matiere}
                                    <br />
                                    <small>
                                        coeff: {matiere.coefficient}
                                    </small>
                                </th>
                            ))}
                            <th>Moyenne</th>
                            <th>Observation</th>
                            <th>Actions</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {resultatFiltres.length > 0 ? (
                            resultatFiltres.map((etudiant) => (
                                <tr key={etudiant.id_etudiant} style={{height:'6vh'}}>
                                    <td><center>{etudiant.rang}</center></td>
                                    <td>{etudiant.nom} {""} {etudiant.prenom}</td>

                                    {matieres.map((matiere) => {
                                        const matiereEtudiant = etudiant.matieres.find(
                                            m => 
                                                m.id_matiere === matiere.id_matiere
                                        );
                                        return (
                                            <td key={matiere.id_matiere}> <center>{matiereEtudiant?.note !== null && 
                                                matiereEtudiant?.note !== undefined ? `${matiereEtudiant.note}/20`: 
                                                "Aucune note enregistrée"}</center>
                                            </td>
                                        );
                                    })}
                                   
                                    <td style={{
                                        color: Number(etudiant.moyenne) < 10
                                            ? "red"
                                            : "white" 
                                    }}>
                                        {Number(etudiant.moyenne).toFixed(2)} {"/20"}
                                    </td>
                                    <td style={{
                                        color: Number(etudiant.moyenne) < 10
                                            ? "red"
                                            : "white" 
                                    }}> <center>
                                        {etudiant.observation}
                                        </center>
                                    </td>
                                    <td> 
                                        <center>
                                        <button className="bouton-resultat" onClick={() => modifierNotes(etudiant)}>
                                            Modifier 
                                        </button>
                                        <button className="bouton-resultat" onClick={() => 
                                            exporterPDF(etudiant.id_inscription, idTypeExamen

                                            )}>
                                            Relevé
                                        </button>
                                        <button className="bouton-resultat1" onClick={() => supprimerNotes(
                                            etudiant.id_inscription, idTypeExamen
                                        )}>Supprimer</button>
                                        </center>
                                    </td>

                                </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan={8} style={{height: "40px"}}>
                                    <center>
                                        Aucun resultat pour cette la selection
                                    </center>
                                </td>
                                
                            </tr>
                        )}
                    </tbody>
                </table>
                
                </div> 
            )}
            
        </>
    );

}
export default Resultat;