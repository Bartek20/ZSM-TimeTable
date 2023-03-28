export const MESSAGES = {
	EMPTY: {
		o: 'Wybrana klasa nie ma w planie żadnych zajęć',
		n: 'Wybrany nauczyciel nie ma w planie żadnych lekcji',
		s: 'W wybranej sali nie ma żadnych lekcji'
	}
}

export const DAYS = {
	poniedziałek: 0,
	wtorek: 1,
	środa: 2,
	czwartek: 3,
	piątek: 4,
	sobota: 5,
	niedziela: 6,
};

export const LESSONS = {
	praktyki: 'Praktyki CKZ',
	wf: 'WF',
	wos: 'WOS',
	matematyka: 'Matematyka',
	r_matematyka: 'Matematyka (R)',
	'j.polski': 'J. Polski',
	'j.angielski': 'J. Angielski',
	r_angielski: 'J. Angielski (R)',
	'j.niemiecki': 'J. Niemiecki',
	informatyka: 'Informatyka',
	'r_informat.': 'Informatyka (R)',
	fizyka: 'Fizyka',
	r_fizyka: 'Fizyka (R)',
	u_fizyka: 'Fizyka (U)',
	geografia: 'Geografia',
	r_geografia: 'Geografia (R)',
	biologia: 'Biologia',
	historia: 'Historia',
	chemia: 'Chemia',
	e_dla_bezp: 'EDB',
	Fil: 'Filozofia',
	religia: 'Religia',
	'u_hist.i sp.': 'Hist. i Sp. (U)',
	'przedsięb.': 'Przedsiębiorczość',
	'zaj. wych.': 'L. Wychowawcza',
	'godz. wych.': 'L. Wychowawcza',
};

export const TEACHERS = {
	'S.Świetlik (SS)': {
		name: 'Sławomir',
		surname: 'Świetlik',
		code: 'SS',
	},
	'B.Piękoś-Kwolek (BP)': {
		name: 'Bożena',
		surname: 'Piękoś-Kwolek',
		code: 'BP',
	},
	'A.Romaszuk (RA)': {
		name: 'Alicja',
		surname: 'Romaszuk',
		code: 'RA',
	},
	'A.Kulasa (KU)': {
		name: 'Andrzej',
		surname: 'Kulasa',
		code: 'KU',
	},
	'I.Adamiec-Zielińska (IZ)': {
		name: 'Iwona',
		surname: 'Adamiec-Zielińska',
		code: 'IZ',
	},
	'A.Aeroklub Rzeszowski (AA)': {
		name: 'Aeroklub Rzeszowki',
		code: 'AA',
	},
	'M.Bajor (MB)': {
		name: 'Monika',
		surname: 'Bajor',
		code: 'MB',
	},
	'M.Bardzik (BR)': {
		name: 'Magdalena',
		surname: 'Bardzik',
		code: 'BR',
	},
	'A.Bartyzel (AB)': {
		name: 'Alicja',
		surname: 'Bartyzel',
		code: 'AB',
	},
	'M.Berrahal (BM)': {
		name: 'Mariola',
		surname: 'Berrahal',
		code: 'BM',
	},
	// Brak rozwinięcia
	'N.Bołba (NK)': {
		name: 'N.',
		surname: 'Bołba',
		code: 'NK',
	},
	'B.Brzęk (BB)': {
		name: 'Barbara',
		surname: 'Brzęk',
		code: 'BB',
	},
	'A.Buć (Bu)': {
		name: 'Agnieszka',
		surname: 'Buć',
		code: 'Bu',
	},
	'c.Centrum Kształcenia Zawodowego (CK)': {
		name: 'Centrum Kształcenia Zawodowego',
		code: 'CK',
	},
	'J.Cichoń (JC)': {
		name: 'Joanna',
		surname: 'Cichoń',
		code: 'JC',
	},
	// Brak rozwinięcia
	'P.Cyrek (CY)': {
		name: 'P.',
		surname: 'Cyrek',
		code: 'CY',
	},
	'B.Czach (CB)': {
		name: 'Bogdan',
		surname: 'Czach',
		code: 'CY',
	},
	'P.Czajor (CP)': {
		name: 'Piotr',
		surname: 'Czajor',
		code: 'CP',
	},
	'A.Czechowicz (CZ)': {
		name: 'Agata',
		surname: 'Czechowicz',
		code: 'CZ',
	},
	'A.Domagała (LA)': {
		name: 'Anna',
		surname: 'Domagała',
		code: 'LA',
	},
	'E.Dragulska (ED)': {
		name: 'Edyta',
		surname: 'Dragulska',
		code: 'ED',
	},
	'M.Drozd (DO)': {
		name: 'Mariusz',
		surname: 'Drozd',
		code: 'DO',
	},
	'A.Dytko (DA)': {
		name: 'Adam',
		surname: 'Dytko',
		code: 'DA',
	},
	'E.Emeaero (EE)': {
		name: 'Emeaero',
		code: 'EE',
	},
	'A.Frydrych (AF)': {
		name: 'Andrzej',
		surname: 'Frydrych',
		code: 'AF',
	},
	// Brak rozwinięcia
	'M.Gorol (MG)': {
		name: 'M.',
		surname: 'Gorol',
		code: 'MG',
	},
	// Brak rozwinięcia
	'O.Gorol (OG)': {
		name: 'O.',
		surname: 'Gorol',
		code: 'OG',
	},
	'D.Grudziński (DG)': {
		name: 'Dawid',
		surname: 'Grudziński',
		code: 'DG',
	},
	'L.Grzesik (LG)': {
		name: 'Leokadia',
		surname: 'Grzesik',
		code: 'LG',
	},
	'M.Haber (HM)': {
		name: 'Marek',
		surname: 'Haber',
		code: 'HM',
	},
	'B.Hałucha  (BH)': {
		name: 'Bożena',
		surname: 'Hałucha',
		code: 'BH',
	},
	'H.Heli One (HO)': {
		name: 'Heli One',
		code: 'HO',
	},
	'A.Kapłon (KA)': {
		name: 'Agnieszka',
		surname: 'Kapłon',
		code: 'KA',
	},
	'B.Kataniak-Stefańska (SB)': {
		name: 'Bożena',
		surname: 'Kataniak-Stefańska',
		code: 'SB',
	},
	// Brak rozwinięcia
	'E.Kijowska (GV)': {
		name: 'E.',
		surname: 'Kijowska',
		code: 'GV',
	},
	'M.Kisiel (MK)': {
		name: 'Mariusz',
		surname: 'Kisiel',
		code: 'MK',
	},
	'Z.Kłeczek (ZK)': {
		name: 'Zdzisław',
		surname: 'Kłeczek',
		code: 'ZK',
	},
	// Brak rozwinięcia
	'K.Kołodziej (KR)': {
		name: 'K.',
		surname: 'Kołodziej',
		code: 'KR',
	},
	'M.Kołodziej (KI)': {
		name: 'Magdalena',
		surname: 'Kołodziej',
		code: 'KI',
	},
	'P.Korbecki (KE)': {
		name: 'Piotr',
		surname: 'Korbecki',
		code: 'KE',
	},
	'A.Kot (KT)': {
		name: 'Alicja',
		surname: 'Kot',
		code: 'KT',
	},
	'M.Kot-Nowicka (MN)': {
		name: 'Magdalena',
		surname: 'Kot-Nowicka',
		code: 'MN',
	},
	// Brak rozwinięcia
	'D.Kotowicz (DK)': {
		name: 'D.',
		surname: 'Kotowicz',
		code: 'DK',
	},
	// Brak rozwinięcia
	'J.Kozicki (KC)': {
		name: 'J.',
		surname: 'Kozicki',
		code: 'KC',
	},
	'I.Krużel (IK)': {
		name: 'Iwona',
		surname: 'Krużel',
		code: 'IK',
	},
	'W.Kubala (KB)': {
		name: 'Wojciech',
		surname: 'Kubala',
		code: 'KB',
	},
	'D.Kustra (KD)': {
		name: 'Dorota',
		surname: 'Kustra',
		code: 'KD',
	},
	'L.LineTech (LL)': {
		name: 'LineTech',
		code: 'LL',
	},
	'K.Lizak (LK)': {
		name: 'Kinga',
		surname: 'Lizak',
		code: 'LK',
	},
	'D.Łagowska (DL)': {
		name: 'Dorota',
		surname: 'Łagowska',
		code: 'DL',
	},
	'S.Łoboda  (SŁ)': {
		name: 'Sławomir',
		surname: 'Łoboda',
		code: 'SŁ',
	},
	'W.Machowska (WM)': {
		name: 'Wioletta',
		surname: 'Machowska',
		code: 'WM',
	},
	'D.Michnia (MI)': {
		name: 'Dorota',
		surname: 'Michnia',
		code: 'MI',
	},
	'M.Mucha (MU)': {
		name: 'Marta',
		surname: 'Mucha',
		code: 'MU',
	},
	'J.Nazarko (JN)': {
		name: 'Jolanta',
		surname: 'Nazarko',
		code: 'JN',
	},
	'A.Nazimek (NA)': {
		name: 'Adam',
		surname: 'Nazimek',
		code: 'NA',
	},
	'J.Pasterz (JU)': {
		name: 'Justyna',
		surname: 'Pasterz',
		code: 'JU',
	},
	'A.Pawlak (AP)': {
		name: 'Agata',
		surname: 'Pawlak',
		code: 'AP',
	},
	'E.Pitera (EP)': {
		name: 'Elżbieta',
		surname: 'Pitera',
		code: 'EP',
	},
	'J.Płonka (PŁ)': {
		name: 'Jarosław',
		surname: 'Płonka',
		code: 'PŁ',
	},
	'K.Potoczna (KP)': {
		name: 'Krystyna',
		surname: 'Potoczna',
		code: 'KP',
	},
	'P.Pratt Whitney AeroPower (PT)': {
		name: 'Pratt & Whitney AeroPower',
		code: 'PT',
	},
	'C.Prokop (PK)': {
		name: 'Cezary',
		surname: 'Prokop',
		code: 'PK',
	},
	'D.Prokopik (DP)': {
		name: 'Daniel',
		surname: 'Prokopik',
		code: 'DP',
	},
	'P.Pustelny (PP)': {
		name: 'Piotr',
		surname: 'Pustelny',
		code: 'PP',
	},
	'P.Rosa (RP)': {
		name: 'Paweł',
		surname: 'Rosa',
		code: 'RP',
	},
	'G.Różycki (RG)': {
		name: 'Grzegorz',
		surname: 'Różycki',
		code: 'RG',
	},
	'S.Salony fryzjerskie (FR)': {
		name: 'Salony fryzjerskie',
		code: 'FR',
	},
	// Brak rozwinięcia
	'B.Stadnik (BS)': {
		name: 'B.',
		surname: 'Stadnik',
		code: 'BS',
	},
	'S.Stawarz (ST)': {
		name: 'Sławomir',
		surname: 'Stawarz',
		code: 'ST',
	},
	'L.Sulencka (SL)': {
		name: 'Lucyna',
		surname: 'Sulencka',
		code: 'SL',
	},
	'E.Surowiec (SR)': {
		name: 'Ewelina',
		surname: 'Surowiec',
		code: 'SR',
	},
	'S.Szcząchor (SC)': {
		name: 'Sebastian',
		surname: 'Szcząchor',
		code: 'SC',
	},
	'S.Szela (SE)': {
		name: 'Stanisław',
		surname: 'Szela',
		code: 'SE',
	},
	'I.Szetela (IS)': {
		name: 'Ilona',
		surname: 'Szetela',
		code: 'IS',
	},
	'U.Szpuga (SU)': {
		name: 'Urszula',
		surname: 'Szpuga',
		code: 'SU',
	},
	'E.Świder (ES)': {
		name: 'Ewa',
		surname: 'Świder',
		code: 'ES',
	},
	'S.Topolewicz (TO)': {
		name: 'Stanisław',
		surname: 'Topolewicz',
		code: 'TO',
	},
	'A.Uchman (UA)': {
		name: 'Agnieszka',
		surname: 'Uchman',
		code: 'UA',
	},
	'E.Wojakowska (WE)': {
		name: 'Ewa',
		surname: 'Wojakowska',
		code: 'WE',
	},
	'M.Wojtaszek-Hudzik (MW)': {
		name: 'Magdalena',
		surname: 'Wojtaszek-Hudzik',
		code: 'MW',
	},
	'M.Wiśniowska (WI)': {
		name: 'Monika',
		surname: 'Wiśniowska',
		code: 'WI',
	},
	// Brak rozwinięcia
	'P.Zwiercan (ZW)': {
		name: 'P.',
		surname: 'Zwiercan',
		code: 'ZW',
	},
	'p.vacat (PV)': {
		name: 'Vacat',
		code: 'PV',
	},
	'r.vacat (VR)': {
		name: 'Vacat',
		code: 'VR',
	},
	'W.vacat (VW)': {
		name: 'Vacat',
		code: 'VW',
	},
};
