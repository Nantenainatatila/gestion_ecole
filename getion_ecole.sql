--
-- PostgreSQL database dump
--

\restrict AjcUQmBANnykedw8kXxaYFpVorOmjRcQL2d0q6F8hBdPm8KEFNb5Jb0v9R3Fica

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-09-19 16:13:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 32971)
-- Name: annee_scolaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annee_scolaire (
    id_annee integer NOT NULL,
    annee character varying(9) NOT NULL
);


ALTER TABLE public.annee_scolaire OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32970)
-- Name: annee_scolaire_id_annee_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.annee_scolaire_id_annee_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.annee_scolaire_id_annee_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 221
-- Name: annee_scolaire_id_annee_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.annee_scolaire_id_annee_seq OWNED BY public.annee_scolaire.id_annee;


--
-- TOC entry 220 (class 1259 OID 32962)
-- Name: etudiants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etudiants (
    id_etudiant integer NOT NULL,
    nom character varying(50) NOT NULL,
    prenom character varying(50),
    adresse character varying(100),
    date_naissance date,
    telephone character varying(20),
    matricule character varying(20),
    lieu_naissance character varying(100)
);


ALTER TABLE public.etudiants OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32961)
-- Name: etudiants_id_etudiant_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etudiants_id_etudiant_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etudiants_id_etudiant_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 219
-- Name: etudiants_id_etudiant_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etudiants_id_etudiant_seq OWNED BY public.etudiants.id_etudiant;


--
-- TOC entry 230 (class 1259 OID 33010)
-- Name: inscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscriptions (
    id_inscription integer NOT NULL,
    id_etudiant integer NOT NULL,
    id_annee integer NOT NULL,
    id_mention integer NOT NULL,
    id_niveau integer NOT NULL
);


ALTER TABLE public.inscriptions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 33009)
-- Name: inscriptions_id_inscription_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inscriptions_id_inscription_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscriptions_id_inscription_seq OWNER TO postgres;

--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 229
-- Name: inscriptions_id_inscription_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inscriptions_id_inscription_seq OWNED BY public.inscriptions.id_inscription;


--
-- TOC entry 228 (class 1259 OID 33000)
-- Name: matieres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matieres (
    id_matiere integer NOT NULL,
    nom_matiere character varying(100) NOT NULL,
    coefficient integer NOT NULL
);


ALTER TABLE public.matieres OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 32999)
-- Name: matieres_id_matiere_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matieres_id_matiere_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matieres_id_matiere_seq OWNER TO postgres;

--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 227
-- Name: matieres_id_matiere_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matieres_id_matiere_seq OWNED BY public.matieres.id_matiere;


--
-- TOC entry 235 (class 1259 OID 33119)
-- Name: matricule_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matricule_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matricule_seq OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 33042)
-- Name: mention_matiere; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mention_matiere (
    id_mention_matiere integer NOT NULL,
    id_mention integer NOT NULL,
    id_matiere integer NOT NULL
);


ALTER TABLE public.mention_matiere OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 33041)
-- Name: mention_matiere_id_mention_matiere_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mention_matiere_id_mention_matiere_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mention_matiere_id_mention_matiere_seq OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 231
-- Name: mention_matiere_id_mention_matiere_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mention_matiere_id_mention_matiere_seq OWNED BY public.mention_matiere.id_mention_matiere;


--
-- TOC entry 226 (class 1259 OID 32991)
-- Name: mentions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mentions (
    id_mention integer NOT NULL,
    nom_mention character varying(100) NOT NULL
);


ALTER TABLE public.mentions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 32990)
-- Name: mentions_id_mention_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mentions_id_mention_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentions_id_mention_seq OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 225
-- Name: mentions_id_mention_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mentions_id_mention_seq OWNED BY public.mentions.id_mention;


--
-- TOC entry 224 (class 1259 OID 32982)
-- Name: niveaux; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.niveaux (
    id_niveau integer NOT NULL,
    niveau character varying(50) NOT NULL
);


ALTER TABLE public.niveaux OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32981)
-- Name: niveaux_id_niveau_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.niveaux_id_niveau_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.niveaux_id_niveau_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 223
-- Name: niveaux_id_niveau_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.niveaux_id_niveau_seq OWNED BY public.niveaux.id_niveau;


--
-- TOC entry 234 (class 1259 OID 33062)
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id_note integer NOT NULL,
    id_inscription integer NOT NULL,
    id_matiere integer NOT NULL,
    note numeric(5,2),
    id_type_examen integer
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 33061)
-- Name: notes_id_note_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_note_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_note_seq OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 233
-- Name: notes_id_note_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_note_seq OWNED BY public.notes.id_note;


--
-- TOC entry 237 (class 1259 OID 33182)
-- Name: types_examen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.types_examen (
    id_type_examen integer NOT NULL,
    type_examen character varying(100) NOT NULL
);


ALTER TABLE public.types_examen OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 33181)
-- Name: types_examen_id_type_examen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.types_examen_id_type_examen_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.types_examen_id_type_examen_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 236
-- Name: types_examen_id_type_examen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.types_examen_id_type_examen_seq OWNED BY public.types_examen.id_type_examen;


--
-- TOC entry 239 (class 1259 OID 33218)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    name_user character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 33217)
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_user_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 238
-- Name: users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;


--
-- TOC entry 4802 (class 2604 OID 32974)
-- Name: annee_scolaire id_annee; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annee_scolaire ALTER COLUMN id_annee SET DEFAULT nextval('public.annee_scolaire_id_annee_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 32965)
-- Name: etudiants id_etudiant; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants ALTER COLUMN id_etudiant SET DEFAULT nextval('public.etudiants_id_etudiant_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 33013)
-- Name: inscriptions id_inscription; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions ALTER COLUMN id_inscription SET DEFAULT nextval('public.inscriptions_id_inscription_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 33003)
-- Name: matieres id_matiere; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matieres ALTER COLUMN id_matiere SET DEFAULT nextval('public.matieres_id_matiere_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 33045)
-- Name: mention_matiere id_mention_matiere; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mention_matiere ALTER COLUMN id_mention_matiere SET DEFAULT nextval('public.mention_matiere_id_mention_matiere_seq'::regclass);


--
-- TOC entry 4804 (class 2604 OID 32994)
-- Name: mentions id_mention; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentions ALTER COLUMN id_mention SET DEFAULT nextval('public.mentions_id_mention_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 32985)
-- Name: niveaux id_niveau; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveaux ALTER COLUMN id_niveau SET DEFAULT nextval('public.niveaux_id_niveau_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 33065)
-- Name: notes id_note; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id_note SET DEFAULT nextval('public.notes_id_note_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 33185)
-- Name: types_examen id_type_examen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_examen ALTER COLUMN id_type_examen SET DEFAULT nextval('public.types_examen_id_type_examen_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 33221)
-- Name: users id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);


--
-- TOC entry 5001 (class 0 OID 32971)
-- Dependencies: 222
-- Data for Name: annee_scolaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annee_scolaire (id_annee, annee) FROM stdin;
1	2026-2027
2	2027-2028
3	2028-2029
4	2029-2030
\.


--
-- TOC entry 4999 (class 0 OID 32962)
-- Dependencies: 220
-- Data for Name: etudiants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etudiants (id_etudiant, nom, prenom, adresse, date_naissance, telephone, matricule, lieu_naissance) FROM stdin;
5	RAHERIMANANTENAO	Antonio	Andoharanofotsy	2004-04-12	0348117966	ETU-0002	Ambohiboria
6	RAKOTO	Tatila	Manantenasoa	2004-02-09	0381965635	ETU-0003	Manantenasoa
7	RANDRIA		Manantenasoa	2026-08-20	0348315440	ETU-0004	Manantenasoa
11	RAHERIMANANTENA 	Antonio	Manantenasoa	2026-08-04	0381965635	ETU-0008	Ambohiboria
12	GEORGES	Antonio	Manantenasoa	2026-08-04	0381965635	ETU-0009	Ambohiboria
13	GEORGES		Manantenasoa	2026-08-04	0381965635	ETU-0010	Ambohiboria
14	RABE	Jean	Akamasoa	2004-08-19	0381965635	ETU-0011	Ambohiboria
15	STEPHAN		Andoharanofotsy	2005-12-03	0348315440	ETU-0012	Farafangana
16	ANDRINIAINA	Flemon	Manantenasoa	2007-08-04	0348117966	ETU-0013	Vangaindrano
8	FENO	Jean	Anjomakely	2026-08-19	0348315440	ETU-0005	Manantenasoa
10	MANANJARA	DAMA	Ambohiboria	2008-12-03	0381965635	ETU-0007	Ambohiboria
17	RAKOTOSON		Anosy	2004-05-01	0348117966	ETU-0014	Anandrotry II
19	FENO		Internant Tsaramasoandro	2006-09-30	0348315440	ETU-0016	Ambohiboria
20	KANTE		Internant Tsaramasoandro	2006-09-30	0348315440	ETU-0017	Ambohiboria
4	NANTENAINA		Internant Tsaramasoandro	2006-09-30	0348315440	ETU-0001	Ambohiboria
\.


--
-- TOC entry 5009 (class 0 OID 33010)
-- Dependencies: 230
-- Data for Name: inscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscriptions (id_inscription, id_etudiant, id_annee, id_mention, id_niveau) FROM stdin;
5	5	1	3	3
6	6	1	4	3
7	7	1	3	2
11	11	1	4	1
12	12	1	3	2
13	13	1	4	3
14	14	1	4	3
15	15	1	4	3
16	16	1	4	3
8	8	1	4	3
10	10	1	4	3
17	17	1	1	3
19	19	2	8	1
20	20	2	1	3
4	4	1	1	3
\.


--
-- TOC entry 5007 (class 0 OID 33000)
-- Dependencies: 228
-- Data for Name: matieres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matieres (id_matiere, nom_matiere, coefficient) FROM stdin;
13	Mathematique	3
14	Maintainance	3
15	Algorithme	4
17	Comptabilité	3
18	Francais	4
19	TIC	3
20	Regas	2
21	Grammaiire	4
22	Psyco-Pedagogie	3
23	Comptabilité	3
24	Mathematique	2
25	Francais	3
26	Psyco-Pedagogie	3
28	Geogaphie	4
27	Histoire	4
29	Regas	3
30	Psyco-Pedagogie	3
31	Francais	2
32	SVT	4
37	TICE	4
41	Psyco-Pedagogie	4
42	Psyco-Pedagogie	4
47	Francais	3
49	Regas	4
\.


--
-- TOC entry 5011 (class 0 OID 33042)
-- Dependencies: 232
-- Data for Name: mention_matiere; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mention_matiere (id_mention_matiere, id_mention, id_matiere) FROM stdin;
13	1	13
14	1	14
15	1	15
17	5	17
18	5	18
19	5	19
20	3	20
21	3	21
22	3	22
23	6	23
24	6	24
25	6	25
26	7	26
28	7	28
27	7	27
29	8	29
30	8	30
31	8	31
32	2	32
37	5	37
41	5	41
42	4	42
47	4	47
49	4	49
\.


--
-- TOC entry 5005 (class 0 OID 32991)
-- Dependencies: 226
-- Data for Name: mentions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mentions (id_mention, nom_mention) FROM stdin;
1	Informatique
2	Paramedicaux
3	Francais
4	Anglais
5	Communication
6	Gestion
7	Histoire-Geographie
8	Malagasy
\.


--
-- TOC entry 5003 (class 0 OID 32982)
-- Dependencies: 224
-- Data for Name: niveaux; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.niveaux (id_niveau, niveau) FROM stdin;
1	L1
2	L2
3	L3
\.


--
-- TOC entry 5013 (class 0 OID 33062)
-- Dependencies: 234
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id_note, id_inscription, id_matiere, note, id_type_examen) FROM stdin;
87	7	21	12.00	4
89	7	20	13.00	4
88	7	22	12.00	4
153	17	15	18.00	4
154	17	13	12.00	4
94	7	21	12.00	1
95	7	22	3.00	1
155	17	14	15.00	4
96	7	20	4.00	1
97	12	21	14.00	4
98	12	22	12.00	4
99	12	20	3.00	4
381	6	47	4.00	4
382	6	42	5.00	4
383	6	49	9.00	4
385	11	47	4.00	4
386	11	42	1.00	4
387	11	49	4.00	4
389	20	15	19.00	4
390	20	14	18.00	4
391	20	13	17.00	4
29	4	15	15.00	4
30	4	14	7.00	4
31	4	13	19.00	4
\.


--
-- TOC entry 5016 (class 0 OID 33182)
-- Dependencies: 237
-- Data for Name: types_examen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.types_examen (id_type_examen, type_examen) FROM stdin;
1	SEMESTRE 1
2	SEMESTRE 2
3	SEMESTRE 3
4	PASSAGE
\.


--
-- TOC entry 5018 (class 0 OID 33218)
-- Dependencies: 239
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id_user, name_user, email, mot_de_passe, role) FROM stdin;
23	NANTENAINA	tatilanantenaina@gmail.com	$2b$10$cPGECYs8StEo/ADx4R6PBe8iDpipVVvzOHq60qvG7r8BJHj7iawtu	admin
24	MANANJARA	mananjar@gmail.com	$2b$10$blQ4WsqjcUTE3RsmFaD3LuujGd9bqNMDxdbrtU0aUvrBkJwfWtE.S	enseignant
\.


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 221
-- Name: annee_scolaire_id_annee_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.annee_scolaire_id_annee_seq', 4, true);


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 219
-- Name: etudiants_id_etudiant_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etudiants_id_etudiant_seq', 21, true);


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 229
-- Name: inscriptions_id_inscription_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscriptions_id_inscription_seq', 21, true);


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 227
-- Name: matieres_id_matiere_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matieres_id_matiere_seq', 53, true);


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 235
-- Name: matricule_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matricule_seq', 18, true);


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 231
-- Name: mention_matiere_id_mention_matiere_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mention_matiere_id_mention_matiere_seq', 53, true);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 225
-- Name: mentions_id_mention_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mentions_id_mention_seq', 8, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 223
-- Name: niveaux_id_niveau_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.niveaux_id_niveau_seq', 3, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 233
-- Name: notes_id_note_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_note_seq', 392, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 236
-- Name: types_examen_id_type_examen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.types_examen_id_type_examen_seq', 4, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 238
-- Name: users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_user_seq', 24, true);


--
-- TOC entry 4819 (class 2606 OID 32980)
-- Name: annee_scolaire annee_scolaire_annee_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annee_scolaire
    ADD CONSTRAINT annee_scolaire_annee_key UNIQUE (annee);


--
-- TOC entry 4821 (class 2606 OID 32978)
-- Name: annee_scolaire annee_scolaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annee_scolaire
    ADD CONSTRAINT annee_scolaire_pkey PRIMARY KEY (id_annee);


--
-- TOC entry 4813 (class 2606 OID 33118)
-- Name: etudiants etudiants_matricule_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT etudiants_matricule_key UNIQUE (matricule);


--
-- TOC entry 4815 (class 2606 OID 32969)
-- Name: etudiants etudiants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT etudiants_pkey PRIMARY KEY (id_etudiant);


--
-- TOC entry 4829 (class 2606 OID 33020)
-- Name: inscriptions inscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT inscriptions_pkey PRIMARY KEY (id_inscription);


--
-- TOC entry 4827 (class 2606 OID 33008)
-- Name: matieres matieres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matieres
    ADD CONSTRAINT matieres_pkey PRIMARY KEY (id_matiere);


--
-- TOC entry 4831 (class 2606 OID 33050)
-- Name: mention_matiere mention_matiere_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mention_matiere
    ADD CONSTRAINT mention_matiere_pkey PRIMARY KEY (id_mention_matiere);


--
-- TOC entry 4825 (class 2606 OID 32998)
-- Name: mentions mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT mentions_pkey PRIMARY KEY (id_mention);


--
-- TOC entry 4823 (class 2606 OID 32989)
-- Name: niveaux niveaux_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveaux
    ADD CONSTRAINT niveaux_pkey PRIMARY KEY (id_niveau);


--
-- TOC entry 4833 (class 2606 OID 33070)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id_note);


--
-- TOC entry 4837 (class 2606 OID 33190)
-- Name: types_examen types_examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_examen
    ADD CONSTRAINT types_examen_pkey PRIMARY KEY (id_type_examen);


--
-- TOC entry 4817 (class 2606 OID 33131)
-- Name: etudiants unique_nom_prenom; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT unique_nom_prenom UNIQUE (nom, prenom);


--
-- TOC entry 4835 (class 2606 OID 33212)
-- Name: notes unique_note; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT unique_note UNIQUE (id_matiere, id_inscription, id_type_examen);


--
-- TOC entry 4839 (class 2606 OID 33232)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4841 (class 2606 OID 33230)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- TOC entry 4842 (class 2606 OID 33026)
-- Name: inscriptions fk_annee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT fk_annee FOREIGN KEY (id_annee) REFERENCES public.annee_scolaire(id_annee) ON DELETE CASCADE;


--
-- TOC entry 4843 (class 2606 OID 33021)
-- Name: inscriptions fk_etudiant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT fk_etudiant FOREIGN KEY (id_etudiant) REFERENCES public.etudiants(id_etudiant) ON DELETE CASCADE;


--
-- TOC entry 4844 (class 2606 OID 33031)
-- Name: inscriptions fk_mention; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT fk_mention FOREIGN KEY (id_mention) REFERENCES public.mentions(id_mention) ON DELETE CASCADE;


--
-- TOC entry 4846 (class 2606 OID 33056)
-- Name: mention_matiere fk_mm_matiere; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mention_matiere
    ADD CONSTRAINT fk_mm_matiere FOREIGN KEY (id_matiere) REFERENCES public.matieres(id_matiere) ON DELETE CASCADE;


--
-- TOC entry 4847 (class 2606 OID 33051)
-- Name: mention_matiere fk_mm_mention; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mention_matiere
    ADD CONSTRAINT fk_mm_mention FOREIGN KEY (id_mention) REFERENCES public.mentions(id_mention) ON DELETE CASCADE;


--
-- TOC entry 4845 (class 2606 OID 33036)
-- Name: inscriptions fk_niveau; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT fk_niveau FOREIGN KEY (id_niveau) REFERENCES public.niveaux(id_niveau) ON DELETE CASCADE;


--
-- TOC entry 4848 (class 2606 OID 33071)
-- Name: notes fk_note_inscription; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_note_inscription FOREIGN KEY (id_inscription) REFERENCES public.inscriptions(id_inscription) ON DELETE CASCADE;


--
-- TOC entry 4849 (class 2606 OID 33076)
-- Name: notes fk_note_matiere; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_note_matiere FOREIGN KEY (id_matiere) REFERENCES public.matieres(id_matiere) ON DELETE CASCADE;


--
-- TOC entry 4850 (class 2606 OID 33198)
-- Name: notes fk_notes_types_examen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_notes_types_examen FOREIGN KEY (id_type_examen) REFERENCES public.types_examen(id_type_examen) ON DELETE CASCADE;


-- Completed on 2026-09-19 16:13:43

--
-- PostgreSQL database dump complete
--

\unrestrict AjcUQmBANnykedw8kXxaYFpVorOmjRcQL2d0q6F8hBdPm8KEFNb5Jb0v9R3Fica

