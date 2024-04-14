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
  if (Object.keys(appConfigs.value.timetable[ obj ]).length === 0) {
    appConfigs.value.timetable[ obj ] = data
    return
  }
  if (obj === 'shortLessons') {
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
    return
  }
  oldData.forEach((key) => {
    if (!newData.includes(key)) {
      diff.push({
        idx: key,
        src: appConfigs.value.timetable[ obj ][ key ],
        dest: undefined
      })
      appConfigs.value.timetable[ obj ][ key ] = undefined
      if (obj === 'teachers' || obj === 'rooms') appConfigs.value.database[obj][ key ] = undefined
      if (obj === 'subjects') appConfigs.value.database.subjects[
        key.replace(/ \([UR]{1}\)/, '')
      ] = undefined
    }
  })
  newData.forEach((key) => {
    let isDiff = false
    if ((obj === 'levels' || obj === 'classes') && data[ key ] !== appConfigs.value.timetable[obj][key]) isDiff = true
    if (obj === 'teachers' && (
      data[ key ].name !== appConfigs.value.timetable.teachers[ key ].name ||
      data[ key ].surname !== appConfigs.value.timetable.teachers[ key ].surname ||
      data[ key ].code !== appConfigs.value.timetable.teachers[ key ].code
    )) isDiff = true
    if (obj === 'rooms' && (
      data[ key ].name !== appConfigs.value.timetable.rooms[ key ].name ||
      data[ key ].level !== appConfigs.value.timetable.rooms[ key ].level
    )) isDiff = true
    if (obj === 'subjects' && (
      data[ key ].short !== appConfigs.value.timetable.subjects[ key ].short ||
      data[ key ].full !== appConfigs.value.timetable.subjects[ key ].full
    )) isDiff = true
    if (isDiff) {
      diff.push({
        idx: key,
        src: appConfigs.value.timetable[obj][ key ],
        dest: data[ key ]
      })
      appConfigs.value.timetable[obj][ key ] = data[ key ]
      if (obj === 'teachers' || obj === 'rooms') appConfigs.value.database[obj][ key ] = undefined
      if (obj === 'subjects') appConfigs.value.database.subjects[
        key.replace(/ \([UR]{1}\)/, '')
      ] = undefined
    }
  })
  if (diff.length) {
    let msg = `${MESSAGES[obj]}:`
    diff.forEach(
      (d) => {
        let template = ''
        if (obj === 'levels' || obj === 'classes') template = `\n${d.idx}: ${d.src} -> ${d.dest}`
        if (obj === 'teachers') template = `\n${d.idx}: ${d.src?.name} ${d.src?.surname} (${d.src?.code}) -> ${d.dest?.name} ${d.dest?.surname} (${d.dest?.code})`
        if (obj === 'rooms') template = `\n${d.idx}: ${d.src?.name} (${d.src?.level}) -> ${d.dest?.name} (${d.dest?.level})`
        if (obj === 'subjects') template = `\n${d.idx}: ${d.src?.short} (${d.src?.full}) -> ${d.dest?.short} (${d.dest?.full})`
        msg += template.replace(/ [(]?undefined[)]?/g, '')
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
