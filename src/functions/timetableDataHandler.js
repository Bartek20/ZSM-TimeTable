import appConfigs from '@/stores/configs'
import log from '@/functions/logger'
import { useToast } from 'vue-toastification'

const MESSAGES = {
  shortLessons: 'Zmodyfikowano godziny trwania skróconych lekcji',
  levels: 'Zmodyfikowano nazwy poziomów',
  classes: 'Zmodyfikowano nazwy kierunków',
  teachers: 'Zmodyfikowano dane nauczycieli',
  rooms: 'Zmodyfikowano dane sali',
  subjects: 'Zmodyfikowano dane przedmiotów'
}

const toast = useToast()

export default function parseData(obj, data) {
  if (!obj || ![ 'shortLessons', 'levels', 'classes', 'teachers', 'rooms', 'subjects' ].includes(obj) || !data) {
    log('error', '[App] Brak danych do przetworzenia lub nieprawidłowy obiekt danych')
    return
  }
  const diff = []
  const oldData = Object.keys(appConfigs.value.timetable[ obj ])
  const newData = Object.keys(data)
  if (obj === 'shortLessons' && appConfigs.value.timetable.shortLessons.length === 0) {
    appConfigs.value.timetable.shortLessons = data
    return
  }
  if (obj !== 'shortLessons' && Object.keys(appConfigs.value.timetable[ obj ]).length === 0) {
    appConfigs.value.timetable[ obj ] = data
    return
  }
  switch (obj) {
    case 'shortLessons':
      if (
        appConfigs.value.timetable.shortLessons.length !== data.length ||
        appConfigs.value.timetable.shortLessons.some(
          (v, i) =>
            v.number !== data[ i ].number ||
            v.timeFrom !== data[ i ].timeFrom ||
            v.timeTo !== data[ i ].timeTo
        )
      ) {
        log('warn', '[App] Zmodyfikowano godziny trwania skróconych lekcji')
        toast.info('Zmodyfikowano godziny trwania skróconych lekcji')
        appConfigs.value.timetable.shortLessons = data
      }
      break
    case 'levels':
      oldData.forEach((key) => {
        if (!newData.includes(key)) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.levels[ key ],
            dest: undefined
          })
          appConfigs.value.timetable.levels[ key ] = undefined
        }
      })
      newData.forEach((key) => {
        if (data[ key ] !== appConfigs.value.timetable.levels[ key ]) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.levels[ key ],
            dest: data[ key ]
          })
          appConfigs.value.timetable.levels[ key ] = data[ key ]
        }
      })
      break
    case 'classes':
      oldData.forEach((key) => {
        if (!newData.includes(key)) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.classes[ key ],
            dest: undefined
          })
          appConfigs.value.timetable.classes[ key ] = undefined
        }
      })
      newData.forEach((key) => {
        if (data[ key ] !== appConfigs.value.timetable.classes[ key ]) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.classes[ key ],
            dest: data[ key ]
          })
          appConfigs.value.timetable.classes[ key ] = data[ key ]
        }
      })
      break
    case 'teachers':
      oldData.forEach((key) => {
        if (!newData.includes(key)) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.teachers[ key ],
            dest: undefined
          })
          appConfigs.value.timetable.teachers[ key ] = undefined
          appConfigs.value.database.teachers[ key ] = undefined
        }
      })
      newData.forEach((key) => {
        if (
          !appConfigs.value.timetable.teachers[ key ] ||
          data[ key ].name !== appConfigs.value.timetable.teachers[ key ].name ||
          data[ key ].surname !==
          appConfigs.value.timetable.teachers[ key ].surname ||
          data[ key ].code !== appConfigs.value.timetable.teachers[ key ].code
        ) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.teachers[ key ],
            dest: data[ key ]
          })
          appConfigs.value.timetable.teachers[ key ] = data[ key ]
          appConfigs.value.database.teachers[ key ] = undefined
        }
      })
      break
    case 'rooms':
      oldData.forEach((key) => {
        if (!newData.includes(key)) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.rooms[ key ],
            dest: undefined
          })
          appConfigs.value.timetable.rooms[ key ] = undefined
          appConfigs.value.database.rooms[ key ] = undefined
        }
      })
      newData.forEach((key) => {
        if (
          !appConfigs.value.timetable.rooms[ key ] ||
          data[ key ].level !== appConfigs.value.timetable.rooms[ key ].level ||
          data[ key ].name !== appConfigs.value.timetable.rooms[ key ].name
        ) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.rooms[ key ],
            dest: data[ key ]
          })
          appConfigs.value.timetable.rooms[ key ] = data[ key ]
          appConfigs.value.database.rooms[ key ] = undefined
        }
      })
      break
    case 'subjects':
      oldData.forEach((key) => {
        if (!newData.includes(key)) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.subjects[ key ],
            dest: undefined
          })
          appConfigs.value.timetable.subjects[ key ] = undefined
          appConfigs.value.database.subjects[
            key.replace(/ \([UR]{1}\)/, '')
          ] = undefined
        }
      })
      newData.forEach((key) => {
        if (
          !appConfigs.value.timetable.subjects[ key ] ||
          data[ key ].short !==
          appConfigs.value.timetable.subjects[ key ].short ||
          data[ key ].full !== appConfigs.value.timetable.subjects[ key ].full
        ) {
          diff.push({
            idx: key,
            src: appConfigs.value.timetable.subjects[ key ],
            dest: data[ key ]
          })
          appConfigs.value.timetable.subjects[ key ] = data[ key ]
          appConfigs.value.database.subjects[
            data[ key ].short.replace(/ \([UR]{1}\)/, '')
          ] = undefined
        }
      })
      break
    // no default
  }
  if (diff.length) {
    let msg = MESSAGES[ obj ] + ':'
    diff.forEach(
      (d) => {
        let text = ''
        if (obj === 'levels' || obj === 'classes') text = `\n${d.idx}: ${d.src} -> ${d.dest}`
        if (obj === 'teachers') text = `\n${d.idx}: ${d.src?.name} ${d.src?.surname} (${d.src?.code}) -> ${d.dest?.name} ${d.dest?.surname} (${d.dest?.code})`
        if (obj === 'rooms') text = `\n${d.idx}: ${d.src?.name} (${d.src?.level}) -> ${d.dest?.name} (${d.dest?.level})`
        if (obj === 'subjects') text = `\n${d.idx}: ${d.src?.short} (${d.src?.full}) -> ${d.dest?.short} (${d.dest?.full})`
        msg += text.replace(/ [(]?undefined[)]?/g, '')
          .replace(': ->', ': Nieznany ->')
          .replace(/->$/, '-> Nieznany')
      }
    )
    log('warn', '[App]', msg)
    toast.info(MESSAGES[ obj ])
    if (obj === 'rooms') appConfigs.value.database.rooms = {}
    if (obj === 'classes') appConfigs.value.database.classes = {}
  }
}
