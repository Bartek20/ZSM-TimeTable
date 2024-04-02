import appConfigs from '@/stores/configs'

function parseClass (name) {
  let title, heading, sidebar, search

  const regexData = name.match(/(\d\w+) \d([\w ]+)/)
  if (regexData) {
    const classData = {
      class: regexData[1],
      specialities: regexData[2].split(' ')
    }
    title = classData.class
    heading = classData.class
    sidebar = classData.class
    search = {
      name: classData.class
    }
    classData.specialities.forEach((speciality) => {
      const specialityData = appConfigs.value.timetable.classes[speciality]
      sidebar = `${sidebar} ${speciality}`
      search[speciality] = speciality
      if (specialityData === undefined) {
        addUnknowns('classes', speciality)
        heading = `${heading} ${speciality}`
      } else {
        heading = `${heading} ${specialityData}`
      }
    })
  }

  return {
    title: title ?? name,
    heading: heading ?? name,
    sidebar: sidebar ?? name,
    search: search ?? { name }
  }
}
function parseTeacher (name) {
  let title, heading, sidebar, search

  let teacherData = appConfigs.value.timetable.teachers[name]
  if (teacherData === undefined) {
    addUnknowns('teachers', name)
    const regexData = name.match(/(.*\.)(.*) \((.*)\)/)
    if (regexData) {
      teacherData = {
        name: regexData[1],
        surname: regexData[2],
        code: regexData[3]
      }
    }
  }
  title = [teacherData.name, teacherData.surname].filter((e) => e).join(' ')
  heading = [teacherData.name, teacherData.surname, `(${teacherData.code})`]
    .filter((e) => e)
    .join(' ')
  sidebar =
    // CKZ
    name === 'c.Centrum Kształcenia Zawodowego (CK)'
      ? `CKZ (${teacherData.code})`
      : // Nauczyciel VACAT
      name.includes('vacat')
        ? `VACAT (${teacherData.code})`
        : // Nazwa specjalna
          !teacherData.surname
            ? `${teacherData.name} (${teacherData.code})`
            : // Zwykłe przypadki
              [
              `${teacherData.name.charAt(0)}.`,
              teacherData.surname,
              `(${teacherData.code})`
              ]
                .filter((e) => e)
                .join(' ')
  search = {
    name: teacherData.name,
    surname: teacherData.surname,
    code: teacherData.code
  }

  return {
    title: title ?? name,
    heading: heading ?? name,
    sidebar: sidebar ?? name,
    search: search ?? { name }
  }
}
function parseClassroom (name) {
  let title, heading, sidebar, search

  const roomData = appConfigs.value.timetable.rooms[name]
  if (roomData === undefined) {
    addUnknowns('rooms', name)
  } else {
    title = name
    heading = roomData.name ? `${name} (${roomData.name})` : name
    sidebar =
      roomData.level !== undefined
        ? `${name} (${appConfigs.value.timetable.levels[roomData.level]})`
        : name
    search = {
      name,
      fullName: roomData.name,
      level:
        roomData.level !== undefined
          ? appConfigs.value.timetable.levels[roomData.level]
          : undefined
    }
  }

  return {
    title: title ?? name,
    heading: heading ?? name,
    sidebar: sidebar ?? name,
    search: search ?? { name }
  }
}

export default function parseName (mode, name) {
  switch (mode) {
    case 'o':
      appConfigs.value.database.classes[name] = parseClass(name || '')
      break
    case 'n':
      appConfigs.value.database.teachers[name] = parseTeacher(name || '')
      break
    case 's':
      appConfigs.value.database.rooms[name] = parseClassroom(name || '')
      break
  }
}
