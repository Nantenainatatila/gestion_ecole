import {createContext, useContext, useState} from "react";

const AnneeContext = createContext();

export function AnneeProvider({ children }) {
    const [idAnnee, setIdAnnee] = useState( localStorage.getItem("idAnnee") || "");
    const [annee, setAnnee] = useState(localStorage.getItem("annee") || "");

    const changerAnnee = (id, libelle) => {
        setIdAnnee(id);
        setAnnee(libelle);
         localStorage.setItem("idAnnee", id);
         localStorage.setItem("annee", libelle);
    };

    return (
        <AnneeContext.Provider
            value={{
                idAnnee,
                annee,
                changerAnnee
            }}
        >
                {children}
            
        </AnneeContext.Provider>
    );
}
export function useAnnee() {
    return useContext(AnneeContext);
}