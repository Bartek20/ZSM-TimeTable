const appConfigs = useStorage(
  "appConfigs",
  {
    // PWA Configs
    app: {
      version: undefined,
      lastFetched: null,
      isTeacher: false,
    },
    // School Data configured in schoolData.js
    school: {
      homeURL: undefined,
      timetableURL: undefined,
      logoDescription: "Logo Szkoły",
      allowStudentsOldView: false,
      allowStrudentsViewTeachers: true,
      allowStrudentsViewRooms: true,
      showHolidaysView: true,
    },
    // Timetable Data configured in timetableData.js
    timetable: {
      shortLessons: [],
      levels: {},
      classes: {},
      teachers: {},
      rooms: {},
      subjects: {},
    },
    // Parsed data store
    database: {
      rooms: {},
      teachers: {},
      classes: {},
      subjects: {},
    },
    // History
    history: [],
    // Settings
    user: {
      colorMode: "light",
      viewMode: "new",
      forceTablet: false,
      shortLessons: false,
      showCurrent: true,
      showColors: true,
      showBreaks: true,
    },
  },
  localStorage,
  { mergeDefaults: true },
);

export default appConfigs;
