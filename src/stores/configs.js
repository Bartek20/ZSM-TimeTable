function deepMerge(defaults, store) {
  if (!defaults) return undefined
  const keys = Object.keys(defaults)
  for (let key of keys) {
    // Store key does not exist
    if (store[ key ] === undefined) {
      store[ key ] = defaults[ key ]
      continue
    }
    // Key types does not match
    if (typeof store[ key ] !== typeof defaults[ key ]) {
      store[ key ] = defaults[ key ]
      continue
    }
    // Key is object - deep merge
    if (typeof defaults[ key ] === "object") {
      deepMerge(defaults[ key ], store[ key ])
      continue
    }
  }
  return store
}

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
  { mergeDefaults: (store, defaults) => deepMerge(defaults, store) },
);

export default appConfigs;
