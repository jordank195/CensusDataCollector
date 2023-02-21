import census from 'citysdk'
import fs from 'fs'
import * as XLSX from 'xlsx/xlsx.mjs';
import fips from 'fips-county-codes'
import { getCountyByFips } from "@nickgraffis/us-counties"
import promptSync from 'prompt-sync'
const prompt = promptSync();
XLSX.set_fs(fs);
const apiKey = 'c3889f5e4df523b520093ced0ab154168e094ead'
const d = Date.now()
let dateHex = d.toString(16)
var sourcePathArray = ['acs', 'acs1']
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


var years = []
var yearEntry = prompt("Enter all years, separated by a comma (,): ")  // Prompt to enter query year
yearEntry = yearEntry.replace(/\s/g, '')
years = yearEntry.split(',')


var sourcePathEntry = prompt("Enter the source path in url format (e.g. acs/acs1): ")   // Prompt to enter query source path
sourcePathEntry = sourcePathEntry.replace(/\s/g, '');                                   // Tidy up source path (remove any erroneous whitespace)
sourcePathArray = sourcePathEntry.split('/')                                            // census api requires each part of the source path as an array. Splits source into array using / as delimeter


var values = []                                                                         // Pre-declare array used to store the variables used in the query
var valueEntry = prompt("Enter all variables, separated by a comma (,): ")              // Prompt to enter query variables 
valueEntry = valueEntry.replace(/\s/g, '');                                             // Tidy up variable entry to remove whitespace
values = valueEntry.split(',')                                                          // Converts variable entry into array of variables, using commma (,) as delimeter





var workingGeo = {}                                                                                     // Pre-declare new dictionary used for area-value pairs
var areaTypes =  []
console.log(geographicareas)                                                                            // Print out dictionary of geographical areas, assigned a number and stored as key/value pairs
var areaTypeEntry = prompt("Enter the number for each area type, separated by a comma (,): ")           // Prompt to enter all geographical areas for query, using the number (key) that corresponds to the area (value) 
areaTypeEntry = areaTypeEntry.replace(/\s/g, '');                                                       // Tidy up geo area entry to remove whitespace
areaTypes = areaTypeEntry.split(',')                                                                    // Convert geo area entry into array of areas
areaTypes.sort(function(b, a) {return parseInt(a.replace(/,/g,'') - parseInt(b.replace(/,/g,'')));});   // This sorts the array (still numbers) - the api requires parent areas first
for(let i = 0, l = areaTypes.length; i < l; i++){                                                       // For loop will match the keys (numbers entered) with their values (the geographical area type) and then use each area type as a key for a new key/value paired dictionary

    var chosenGeo = geographicareas[areaTypes[i]]                                                       // Match key to geo area
    var areavalue = prompt("Enter area value for "+ chosenGeo + ": ")                                   // Prompt to enter value for specified geo area
    workingGeo[chosenGeo] = areavalue                                                                   // Add area type paired with its value to new dictionary

}


var workingPredicates = {}                                                                              // Pre-declare dictionary for predicates
var predicateTypes = []
var predicateCheck = prompt("Any predicates? (e.g. NAICS1997) y/n: ").toLowerCase()                     // Not all queries require a predicate; checks if predicate(s) needed
if (predicateCheck == 'y'){
    var predicateTypeEntry = prompt("Enter each predicate type, separated by a comma (,): ")            // Prompt to enter predicate type
    predicateTypeEntry = predicateTypeEntry.replace(/\s/g, '')                                          // Tidy up predicate type entry to remove whitespace 
    predicateTypes = predicateTypeEntry.split(',')                                                      // Split entry into array, using comma as delimeter
//    predicateTypes.sort(function(b, a) {
//   return parseInt(a.replace(/,/g,'') - parseInt(b.replace(/,/g,'')));
//   });
//    console.log(predicateTypes)
    for(let i = 0, l = predicateTypes.length; i < l; i++){                                               // Similar to geo entries, creates new key/value paired dictionary of predicate typres and their values

        var chosenPredicate = predicateTypes[i]
        var predicateValue = prompt("Enter predicate value for "+ chosenPredicate + ": ")
        workingPredicates[chosenPredicate] = predicateValue

    }   
}

var consoleCountyOutput = ""    // Pre-declares values used for adding county to excel
var consoleStateOutput = ""     // Pre-declares values used for adding state to excel


// TO-DO: Add comments for section below.
// queryCensus() Query is slightly different depending on if there is or isn't a predicate. Probably more efficient way to run that.
// assignFIPS() cross-references state and counties with FIPS codes
// writeToExcel() adds data to new excel sheet with current date and time in hexadecimal as sheetname.
// Finally prints a pretty message with stars at the end

// Running multiple years in a single query required asynchronous functions, as the for loop that sequenced through each year would finish before the api had finished fetching the data.
// processCensusData() calls each function individually, and awaits a promise to see each call to completion

processCensusData()

async function processCensusData(){

    for (let j = 0, k = years.length; j < k; j++){

        const rawOutput = await queryCensus(years[j]);
        if (rawOutput != null){

           const assignedOutput = await assignFIPS(rawOutput)


            const finshedWriting = await writeToExcel(assignedOutput, years[j])
            console.log(finshedWriting)

            
        

        }
        else{

            console.log('************************')
            console.log('*                      *')    
            console.log('*  No results for '+years[j]+' *')
            console.log('*                      *') 
            console.log('************************')

        }

    }
}

function writeToExcel(results, year){

    return new Promise(resolve => {

            var workbook = XLSX.readFile('Results.xlsb')
            var worksheet = XLSX.utils.json_to_sheet(results);
            XLSX.utils.book_append_sheet(workbook, worksheet, year+'_'+dateHex);
            XLSX.writeFile(workbook, "Results.xlsb");

            var outputMessage = '*       Results added to '+year+'_'+dateHex+ ' in Results.xlsb       *'

            var starsMessage = '*'
            var starsSpaceMessage = '*'

            for(let i = 0, l = outputMessage.length; i < l-2; i++) {

                starsMessage = starsMessage + '*'
                starsSpaceMessage = starsSpaceMessage + ' '

            }

            starsMessage = starsMessage + '*'
            starsSpaceMessage = starsSpaceMessage + '*'


            var completeMessage = starsMessage + "\n" + starsSpaceMessage + "\n" + outputMessage + "\n" + starsSpaceMessage + "\n" + starsMessage



            resolve(completeMessage)

        })
}

function assignFIPS(output){

    return new Promise(resolve => {

        for(let i = 0, l = output.length; i < l; i++) { // Converts state and county fips codes to names



        try{
            var workingState = output[i].state
            output[i].state = states[workingState]
        }
        catch(err){
            if(consoleStateOutput != "Missing state data in the output"){
                consoleStateOutput = "Missing state data in the output"
                console.log("Missing state data in the output")
            }
            
        }
        try{
            var workingCounty = output[i].county
            var fullFips = workingState + workingCounty
            var countyName = getCountyByFips(fullFips)
            output[i].county = countyName.name
            output[i].fips = fullFips
        }
        catch(err){
            
            if(consoleCountyOutput != "Missing county and/or state data in output"){
                consoleCountyOutput = "Missing county and/or state data in output"
                console.log("Missing county and/or state data in output")
            }
            
        }
    

    }


    resolve(output)
})
}

function queryCensus(workingYear){

    return new Promise(resolve => {

    if (predicateCheck == 'y'){

        census(
            {

                vintage: workingYear,
                geoHierarchy: workingGeo,
                sourcePath: sourcePathArray,
                values: values,
                predicates: workingPredicates,
                statsKey: apiKey,
            },
        (err, res) => {

            resolve(res)

        }
        )

    } else{

        census(
            {


            vintage: workingYear,
            geoHierarchy: workingGeo,
            sourcePath: sourcePathArray,
            values: values,
            statsKey: apiKey,


    },
        (err, res) => {


            resolve(res)

        }

        )
}})
}
