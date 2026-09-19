const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authMiddleware = require("./middleware/authMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const mentionRoutes = require("./routes/mentionRoutes");
const niveauRoutes = require("./routes/niveauRoutes");
const anneeRoutes = require("./routes/anneeRoutes");
const inscriptionRoutes = require("./routes/inscriptionRoutes");
const matiereRoutes = require("./routes/matiereRoutes");
const mention_matiereRoutes = require("./routes/matiere_mentionRoutes");
const matieres_par_mentionRoutes = require("./routes/matieres_par_mentionsRoutes");
const types_examenRoutes = require("./routes/type_examenRoutes");
const note_mentionRoutes = require("./routes/note_mentionRoutes");
const note_studentRoutes = require("./routes/note_studentRoutes");
const notesRoutes = require("./routes/notesRoutes");
const resultatsRoutes = require("./routes/resultatsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const usersRoutes = require("./routes/usersRoutes");

 
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);

//protection des routes
app.use(authMiddleware);
//les routes protege
app.use("/api/students", studentRoutes);
app.use("/api/mentions", mentionRoutes);
app.use("/api/niveaux", niveauRoutes);
app.use("/api/annees", anneeRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/matieres", matiereRoutes);
app.use("/api/mentions_matieres", mention_matiereRoutes);
app.use("/api/matieres_par_mentions", matieres_par_mentionRoutes);
app.use('/api/types_examen', types_examenRoutes);
app.use("/api/note_mention", note_mentionRoutes);
app.use("/api/note_student", note_studentRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/resultats", resultatsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admissions", admissionRoutes);



app.listen(3000, () => {
    console.log("Serveur lancé sur le port 3000");
});

