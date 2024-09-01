import appConfigs from '@/stores/configs'

function getDark (str) {
  return stc(str)
}
function getLight (dark) {
  const [r, g, b] = chroma.scale([dark, 'white'])(0.8)._rgb
  return `rgb(${r}, ${g}, ${b})`
}

export default function parseColor (subject) {
  const dark = getDark(subject)
  const light = getLight(dark)
  appConfigs.value.database.subjects[subject] = { light, dark }
}
