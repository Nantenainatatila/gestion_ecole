import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAnnee } from "../context/AnneContext";


function Dashboard() {
    const { idAnnee } = useAnnee();
    const [stats, setStat]   = useState("0");
    const [filieres, setFilieres ] = useState([]);
    const [mentions, setMentions] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [types_examen, setTypes_Examens] = useState([]);
    const [idMention, setIdMention] = useState(1);
    const [idNiveau, setIdNiveau] = useState(3);
    const [idTypeExamen, setIdTypeExamen] = useState(4);
    const [nombres, setNombre] = useState({
        total_etudiants: 0,
        admis: 0,
        non_admis: 0,
        pourcentage_admission: 0,
        listesMat: []
    });

    //charger nombre
    const chargerStatistique = async() => {
        try {
            const response = await api.get(`/admissions/admission`,
                {
                    params: {idAnnee,idMention,idNiveau,idTypeExamen}
                }
            );
            
            setNombre(response.data);
            
        } catch (error) {
            console.error("erreur de recuperation dezs nombre", error);
        }
    };

    useEffect(() => {
        if (!idAnnee || !idMention || !idNiveau || !idTypeExamen) {
            
            return;
        }
        chargerStatistique();
    }, [idAnnee, idMention, idNiveau, idTypeExamen]);

    useEffect(() => {
        const chargerDashboard = async () => {
            try {
                const response = await api.get(
                `/dashboard/dashboard/${idAnnee}`
                );
                setStat(response.data);
            } catch(error) {
                console.error("erreur de recuperation", error);
            }
            
        };
        const ChargerNombreFillieres = async () => {
            try {
                const response = await api.get(`/dashboard/dashboard/filliere/${idAnnee}`
                );
                setFilieres(response.data);
            } catch (error) {
                console.log("erreur de recuperation de nombre filliere");
            }
        };

        chargerDashboard();
        ChargerNombreFillieres();
    }, [idAnnee]);

    // dashboard resultat
    //CHARGER MENTION
    useEffect(() => {
        const chargerMention = async () => {
            try {
                const response = await api.get("/mentions");
                console.log("mentions", response.data);
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


    return(
        <div >
            <div className="dashboard-resultat">
                <div >
                    <h1>Dashboard </h1>
                </div>
                
                <div className="select-dashboard-resultat">
                    <select 
                        value={idMention}
                        onChange={(e) => setIdMention(e.target.value)}
                        required
                    >
                        {mentions.map((mention) => (
                            <option key={mention.id_mention} value={mention.id_mention}>
                                {mention.nom_mention}
                            </option>
                        ))}
                    </select>
                    <select 
                        value={idNiveau}
                        onChange={(e) => setIdNiveau(e.target.value)} 
                        required
                    >
                            {niveaux.map((niveau) => (
                                <option key={niveau.id_niveau} value={niveau.id_niveau}>
                                    {niveau.niveau}
                                </option>
                            ))}
                    </select>
                    <select 
                        value={idTypeExamen}
                        onChange={(e) => setIdTypeExamen(e.target.value)}
                        required
                    >
                        {types_examen.map((type) => (
                            <option 
                                key={type.id_type_examen} 
                                value={type.id_type_examen}
                            >
                                {type.type_examen}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="dashboard">
               
                
                    <div className="container-nombre">
                        <h4>Nombre d'étudiant</h4> 
                       
                        <strong>{nombres.total_etudiants} </strong> <h5>étudiant(s)</h5>
                    </div>
                   
                    <div className="container-nombre">
                        <h4>Admis</h4>
                        <strong>{nombres.admis} </strong> <h5>sur {nombres.total_etudiants} étudiant(s)</h5>
                    </div>
                    <div className="container-nombre">
                        <h4>Non admis</h4>
                        <strong style={{color:'brown'}}>{nombres.non_admis} </strong> <h5>sur {nombres.total_etudiants} étudiant(s)</h5>
                    </div>
                
            </div>
            <div className="second-container">
                <div className="container-nombre2">
                    <div>
                        <center><h4>Nombre d'étudiant par mention</h4></center>
                        {filieres.map((filliere) => (
                            <div className="card" key={filliere.id_mention}>
                                <h3>{filliere.nom_mention}: </h3><span>{Number(filliere.total_etudiants) || 0}</span> 
                            
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pourcentage">
                    <center>
                        <h4>Taux d'admission</h4> <br /><br /><br /><br />
                        <strong>{nombres.pourcentage_admission} %</strong>
                    </center>
                </div>
                <div className="pourcentage">
                    <center>
                        <h4>Nombres des matieres</h4> <br /> <br />
                        <strong>{nombres.totalMatiere} </strong> <br /><br />
                        <p>matiéres(s)</p> 
                    </center>
                    <h5>
                    {nombres.listesMat.map((mat) => (
                         <p   key={mat.id_matiere} >- {mat.nom_matiere}</p>
                    ))}
                   </h5>
                </div>    
            </div>
        </div>
        
    );
}
export default Dashboard;