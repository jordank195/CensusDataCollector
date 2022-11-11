const { counties } = require('./counties')

function addSpaces(name) {
  let returnName = ''
  for (let i = 0; i < name.length; i++) {
    if (name[i].toUpperCase() === name[i]) returnName += ' ' + name[i]
    else returnName += name[i]
  }

  return returnName.trim()
}

function getAllCounties() {
  return counties.map(county => ({ ...county, name: addSpaces(county.name)}))
}

function getCountyByNameIncludes(name) {
  return counties
  .filter(county => addSpaces(county.name).toLowerCase().includes(name.toLowerCase()))
  .map(county => ({ ...county, name: addSpaces(county.name)}))
}

function getCountyByNameStartsWith(name) {
  return counties
  .filter(county => addSpaces(county.name).toLowerCase().startsWith(name.toLowerCase()))
  .map(county => ({ ...county, name: addSpaces(county.name) }))
}

function getCountyByState(stateCode) {
  return counties
  .filter(county => county.state === stateCode)
  .map(county => ({ ...county, name: addSpaces(county.name) }))
}

function getCountyByFips(fips) {
  return counties
  .filter(county => county.FIPS === fips)
  .map(county => ({ ...county, name: addSpaces(county.name) }))?.[0]
}

module.exports = {
  getCountyByNameStartsWith,
  getCountyByNameIncludes,
  getCountyByState,
  getCountyByFips,
  getAllCounties
}
