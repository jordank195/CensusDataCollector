import census from 'citysdk'
import fs from 'fs'
import * as XLSX from 'xlsx/xlsx.mjs';
XLSX.set_fs(fs);


census(
    {
        vintage: '2008',
        geoHierarchy: {
            state: '*',
            county: '*',
        },
        sourcePath: ['acs', 'acs1'],
        values: ['B17002_001M', 'B17002_001MA', 'B17002_001E'],
        //predicates: {
          //  B01001_001E: '0:100000', // number range separated by `:`
       // },
        statsKey: 'c3889f5e4df523b520093ced0ab154168e094ead',
    },
    (err, res) => {
        var workbook = XLSX.utils.book_new();
        var worksheet = XLSX.utils.json_to_sheet(res);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, "Report.xlsb");

        //fs.writeFile('output.json', JSON.stringify(res), () => console.log(res))
        
    }
)

/* result:
    [
      {
        "NAME":"Augusta County, Virginia",
        "B01001_001E" : 75144,
        "state":"51",
        "county":"015"
      },
      {
        "NAME":"Bedford County, Virginia",
        "B01001_001E" : 77974,
        "state":"51",
        "county":"019"
      },
      ... 
    ]
*/