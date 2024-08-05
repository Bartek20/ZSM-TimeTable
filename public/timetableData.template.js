export default {
  // Godziny skrócone obowiązujące w szkole
  shortLessons: [
    {
      number: 0, // Identyfikator lekcji (nr)
      timeFrom: "9:40", // Czas rozpoczęcia lekcji
      timeTo: "10:05", // Czas zakończenia lekcji
    },
  ],
  // Nazwy poziomów stosowanych w części rooms
  levels: {
    "-1": "Piwnica",
    0: "Parter",
  },
  // Układ pomieszczeń na planie (nie wymagane)
  // level - poziom (-1,0,1,2)
  // name - pełna nazwa sali
  rooms: {
    "11a": {
      level: 0,
    },
    "13a": {
      level: 1,
    },
    "25a": {
      level: 2,
    },
    A21: {
      level: 0,
      name: "Aula",
    },
    A: {
      level: 0,
      name: "Aula",
    },
    SGD: {
      level: 0,
      name: "Sala Gimnastyczna",
    },
    SI: {
      level: -1,
      name: "Sala Gimnastyczna",
    },
    CKP: {
      name: "Centrum Kształcenia Praktycznego",
    },
  },
  // Kierunki w szkole (niewymagane)
  classes: {
    BCH: "Biol-chem",
    SKR: "Technik Skrótów",
  },
  // Pełne dane nauczycieli (nie wymagane)
  // name - imię
  // surname - nazwisko (jeśli jako nauczyciel została wpisana np. firma pozostawić puste)
  // code - kod nauczyciele w planie
  teachers: {
    "A.Kowalik (KO)": {
      name: "Adam",
      surname: "Kowalik",
      code: "KO",
    },
    "S.Pitarko-Wrzos (SW)": {
      name: "Stanisława",
      surname: "Pitarko-Wrzos",
      code: "SW",
    },
    "A.Aeroklub Rzeszowski (AA)": {
      name: "Aeroklub Rzeszowki",
      code: "AA",
    },
  },
  // Nazwy przedmiotów (nie wymagane)
  // short - krótka nazwa
  // full - pełne rozwinięcie nazwy (jeśli short to pełna nazwa zostawić puste)
  subjects: {
    praktyki: {
      short: "Praktyki",
    },
    wf: {
      short: "WF",
      full: "Wychowanie Fizyczne",
    },
    wos: {
      short: "WOS",
      full: "Wiedza o Społeczeństwie",
    },
  },
};
