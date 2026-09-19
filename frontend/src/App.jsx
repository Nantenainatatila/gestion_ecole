import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Etudiants from "./pages/Etudiants";
import Listes from "./pages/Listes";
import Matiere from "./pages/Matiere";
import Resultat from "./pages/Resultat";
import ModificationNotes from "./pages/modificationNotes";
import Login from "./pages/Login";
import DashboardLayourt from "./layourts/DashboardLayourt";
import Creer from "./pages/Creer";
import ProtectRoutes from "./composants/ProtectRoutes";
//import "./Navbar.css";

function App() {
  return(
    <BrowserRouter>
    
      
          <Routes>
            {/**Login */}
            <Route path="/login" element={<Login /> } /> 
            <Route path="/creation" element={<Creer /> } />
            {/**Routes protegé */}
            <Route element={<ProtectRoutes />}>
                {/** Tout les Contenue */}
                <Route element={<DashboardLayourt />} >

                    <Route path="/dashoard" element={<Dashboard />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/etudiants" element={<Etudiants />} />
                    <Route path="/listes" element={<Listes />}/>
                    <Route path="/matiere" element={<Matiere />}/>
                    <Route path="/modifier_etudiant/:id" element={<Etudiants />}/>
                    <Route path="/resultat" element={<Resultat />}/>
                    <Route path="/notes/modifier/:idInscription" element={<ModificationNotes />}/>


                </Route>
            </Route>
            

            {/**Page par defaut */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
      
    </BrowserRouter>
  );
}
export default App;