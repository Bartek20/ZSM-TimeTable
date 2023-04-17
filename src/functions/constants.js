export const SB_ANIMATION_DURATION = 300;

export const MESSAGES = {
  ERR: {
    404: {
      icon: 'zsm-not-found-error-icon',
      msg: 'Wybrany plan nie został odnaleziony',
    },
    900: {
      icon: 'zsm-offline-error-icon',
      msg: 'Pobieranie planu nie powiodło się. Najprawdopodobniej jesteś offline.',
    },
    999: {
      icon: 'zsm-unknown-error-icon',
      msg: 'Wystąpił nieznany błąd. Skontaktuj się z twórcą aplikacji.',
    },
  },
  EMPTY: {
    o: 'Wybrana klasa nie ma w planie żadnych zajęć',
    n: 'Wybrany nauczyciel nie ma w planie żadnych lekcji',
    s: 'W wybranej sali nie ma żadnych lekcji',
  },
};

export const MONTHS = {
  stycznia: '01',
  lutego: '02',
  marca: '03',
  kwietnia: '04',
  maja: '05',
  czerwca: '06',
  lipca: '07',
  sierpnia: '08',
  września: '09',
  października: 10,
  listopada: 11,
  grudnia: 12,
};

export const HOURS = {
  0: { number: 0, timeFrom: '7:10', timeTo: '7:55' },
  1: { number: 1, timeFrom: '8:00', timeTo: '8:45' },
  2: { number: 2, timeFrom: '8:50', timeTo: '9:35' },
  3: { number: 3, timeFrom: '9:40', timeTo: '10:25' },
  4: { number: 4, timeFrom: '10:40', timeTo: '11:25' },
  5: { number: 5, timeFrom: '11:30', timeTo: '12:15' },
  6: { number: 6, timeFrom: '12:20', timeTo: '13:05' },
  7: { number: 7, timeFrom: '13:10', timeTo: '13:55' },
  8: { number: 8, timeFrom: '14:00', timeTo: '14:45' },
  9: { number: 9, timeFrom: '14:50', timeTo: '15:35' },
  10: { number: 10, timeFrom: '15:40', timeTo: '16:25' },
  11: { number: 11, timeFrom: '16:40', timeTo: '17:25' },
  12: { number: 12, timeFrom: '17:30', timeTo: '18:15' },
  13: { number: 13, timeFrom: '18:20', timeTo: '19:05' },
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
