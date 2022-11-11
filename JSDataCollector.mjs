import census from 'citysdk'
import fs from 'fs'
import * as XLSX from 'xlsx/xlsx.mjs';
import fips from 'fips-county-codes'
import { getCountyByFips } from "@nickgraffis/us-counties"
import promptSync from 'prompt-sync'
const prompt = promptSync();
XLSX.set_fs(fs);
const d = new Date();
let dateString = d.toUTCString();
const states = {
   "01": "Alabama",
   "02": "Alaska",
   "04": "Arizona",
   "05": "Arkansas",
   "06": "California",
   "08": "Colorado",
   "09": "Connecticut",
   "10": "Delaware",
   "11": "District of Columbia",
   "12": "Florida",
   "13": "Geogia",
   "15": "Hawaii",
   "16": "Idaho",
   "17": "Illinois",
   "18": "Indiana",
   "19": "Iowa",
   "20": "Kansas",
   "21": "Kentucky",
   "22": "Louisiana",
   "23": "Maine",
   "24": "Maryland",
   "25": "Massachusetts",
   "26": "Michigan",
   "27": "Minnesota",
   "28": "Mississippi",
   "29": "Missouri",
   "30": "Montana",
   "31": "Nebraska",
   "32": "Nevada",
   "33": "New Hampshire",
   "34": "New Jersey",
   "35": "New Mexico",
   "36": "New York",
   "37": "North Carolina",
   "38": "North Dakota",
   "39": "Ohio",
   "40": "Oklahoma",
   "41": "Oregon",
   "42": "Pennsylvania",
   "44": "Rhode Island",
   "45": "South Carolina",
   "46": "South Dakota",
   "47": "Tennessee",
   "48": "Texas",
   "49": "Utah",
   "50": "Vermont",
   "51": "Virginia",
   "53": "Washington",
   "54": "West Virginia",
   "55": "Wisconsin",
   "56": "Wyoming",
   "60": "American Samoa",
   "81": "Baker Island",
   "64": "Federated States of Micronesia",
   "66": "Guam",
   "84": "Howland Island",
   "86": "Jarvis Island",
   "67": "Johnston Atoll",
   "89": "Kingman Reef",
   "68": "Marshall Islands",
   "71": "Midway Islands",
   "76": "Navassa Island",
   "69": "Northern Mariana Islands",
   "70": "Palau",
   "95": "Palmyra Atoll",
   "72": "Puerto Rico",
   "74": "U.S. Minor Outlying Islands",
   "78": "Virgin Islands of the U.S.",
   "79": "Wake Island",
   "03": "American Samoa",
   "07": "Canal Zone",
   "14": "Guam",
   "43": "Puerto Rico",
   "52": "Virgin Islands of the U.S."
}
const geographicareas = {
    '1': "alaska-native-regional-corporation",
    '2': 'american-indian-area/alaska-native-area/hawaiian-home-land',
    '3': 'block-group',
    '4': 'combined-new-england-city-and-town-area',
    '5': 'combined-statistical-area',
    '6': 'congressional-district',
    '7': 'consolidated-cities',
    '8': 'county',
    '9': 'county-subdivision',
    '10': 'division',
    '11': 'metropolitan-statistical-area/micropolitan-statistical-area',
    '12': 'new-england-city-and-town-area',
    '13': 'place',
    '14': 'public-use-microdata-area',
    '15': 'region',
    '16': 'school-district-(elementary)',
    '17': 'school-district-(secondary)',
    '18': 'school-district-(unified)',
    '19': 'state',
    '20': 'state-legislative-district-(lower-chamber)',
    '21': 'state-legislative-district-(upper-chamber)',
    '22': 'tract',
    '23': 'urban-area',
    '24': 'us',
    '25': 'zip-code-tabulation-area'
}



const year = prompt("What year? ")
const values = []
var moreValues = 'y'
var geographicarea = 'n'


while(moreValues == 'y'){
    values.push(prompt("What value?"))
    moreValues = prompt("More values? y/n")
}

var defaultGeo = {
    state: '*',
    county: '*'
}

geographicarea = prompt('Geographic area? y/n')

console.log(geographicarea)


if (geographicarea == 'y'){
    console.log(geographicareas)
    var areatype = prompt("Enter area type")
    var areavalue = prompt("Enter area value")
    defaultGeo = {}
    defaultGeo[geographicareas[areatype]] = areavalue
    console.log(defaultGeo)

}



census(
    {
        vintage: year,
        geoHierarchy: defaultGeo,
        sourcePath: ['acs', 'acs1'],
        values: values,
        //predicates: {
          //  B01001_001E: '0:100000', // number range separated by `:`
       // },
        statsKey: 'c3889f5e4df523b520093ced0ab154168e094ead',
    },
    (err, res) => {

        var output = res

        if (output != null){

            try {

                for(let i = 0, l = output.length; i < l; i++) { // Converts state and county fips codes to names
                
                

                    var workingState = output[i].state
                    var workingCounty = output[i].county
                    var fullFips = workingState + workingCounty
                    var countyName = getCountyByFips(fullFips)
                    output[i].state = states[workingState]
                    output[i].county = countyName.name
                    output[i].fips = fullFips
                }
            }
            catch(err){
                    console.log("An error occurred trying to assign state and county names - data will contain unparsed fips codes")
            }    
        
    

        var workbook = XLSX.utils.book_new();
        var worksheet = XLSX.utils.json_to_sheet(res);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, "Results.xlsb");
        //fs.writeFile('output.json', JSON.stringify(res), () => console.log(res))

        console.log('***********************************')
        console.log('*                                 *')    
        console.log('*  Results added to Results.xlsb  *')
        console.log('*                                 *') 
        console.log('***********************************')

        
        } else{

        console.log('****************')
        console.log('*              *')    
        console.log('*  No results  *')
        console.log('*              *') 
        console.log('****************')

    }


    }
)


