const { 
  getCountyByNameStartsWith,
  getCountyByNameIncludes,
  getCountyByState,
  getCountyByFips, 
  getAllCounties
} = require('./index');

function expect(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, but got ${actual}`);
  }
}

function deepComparison(actual, expected) {
  if (typeof actual !== typeof expected) {
    throw new Error(`Expected ${expected}, but got ${actual}`);
  }
  if (typeof actual === 'object') {
    for (let key in actual) {
      deepComparison(actual[key], expected[key]);
    }
  }
}

console.log('Testing Get County By Name Includes')
deepComparison(getCountyByNameIncludes('Los'), [
  { FIPS: '06037', name: 'Los Angeles', state: 'CA' },
  { FIPS: '35028', name: 'Los Alamos', state: 'NM' },
  { FIPS: '60020', name: 'Olosega', state: 'AS' }
])

console.log('Testing Get County By Name Starts With')
deepComparison(getCountyByNameStartsWith('Los'), [
  { FIPS: '06037', name: 'Los Angeles', state: 'CA' },
  { FIPS: '35028', name: 'Los Alamos', state: 'NM' }
])

console.log('Testing Get County By State')
deepComparison(getCountyByState('RI'), [
  { FIPS: '44001', name: 'Bristol', state: 'RI' },
  { FIPS: '44003', name: 'Kent', state: 'RI' },
  { FIPS: '44005', name: 'Newport', state: 'RI' },
  { FIPS: '44007', name: 'Providence', state: 'RI' },
  { FIPS: '44009', name: 'Washington', state: 'RI' }
])

console.log('Testing Get County By Fips')
deepComparison(getCountyByFips('06037'), { FIPS: '06037', name: 'Los Angeles', state: 'CA' })

console.log('Testing Get All Counties')
expect(getAllCounties().length, 3232)

console.log('All tests passed!')