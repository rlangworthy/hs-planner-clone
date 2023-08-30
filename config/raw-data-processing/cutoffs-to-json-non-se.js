const csvParse = require('csv-parse/lib/sync');
const d3 = require('d3')
const fs = require('fs')
const path = require('path')

/* 
 * Converts a .csv version of the non-SE cutoff scores to JSON.
 * Takes a path to two .csv files, one being a list matching SE programs to their cutoff scores,
 * and the other being a list matching SE programs to their school IDs.
 * 
 * The expected format of the cutoff scores .csv is
 * school | programType | cutoffScores
 * -------+-------------+-------------
 *
 *  Where one row represents one highschool program.
 * 
 * The expected format of the school IDS .csv is 
 * School_ID | Short_Name |
 * ----------+------------+
 **/
function nonSECutoffsCSVToJSON(pathToCutoffScores, pathToSchoolIDs) {
    const cutoffScoresCsvFile = fs.readFileSync(pathToCutoffScores, 'utf-8')
    const rawCutOffs  = csvParse(cutoffScoresCsvFile, {
        columns:true
    })
    const schoolIDsCsvFile = fs.readFileSync(pathToSchoolIDs, 'utf-8')
    const rawSchoolIDs  = csvParse(schoolIDsCsvFile, {
        columns:true
    })

    cutOffs = d3.nest().key( k => k['SCHOOL'] + k['PROGRAM']).rollup( ks => {
                            const schoolRow = rawSchoolIDs.find( row => row['Short_Name'] === ks[0]['SCHOOL'] )
                            if (schoolRow === undefined) {
                                throw new Error(`Could not find school ${ks[0]['SCHOOL'].toUpperCase()}`);
                            }
                            const schoolID = schoolRow['School_ID']
                            return {
                                programID: schoolID + '-' +ks[0]['SCHOOL']+' - ' + ks[0]['PROGRAM'],
                                school: ks[0]['SCHOOL'],
                                programType: ks[0]['PROGRAM'],
                                cutoffScores: {
                                    min: parseInt(ks[0]['CUTOFF SCORE'], 10)
                                }
                            }
                        })
                .object(rawCutOffs)

    return JSON.stringify(Object.values(cutOffs), null, 2)
                        
}

const rawDataParentDir = path.resolve(__dirname, "..", "raw-data");
// find the most recent version of the data
const subfolders = fs.readdirSync(rawDataParentDir);
let mostRecentVersion;
for (let i = 0; i < subfolders.length; i++) {
  const subfolderName = subfolders[i];
  // try and parse this subfolder's name as a date
  const subfolderDate = Date.parse(subfolderName);
  if (subfolderDate) {
    if (mostRecentVersion === undefined) {
      mostRecentVersion = subfolderName;
    } else {
      const mostRecentDate = Date.parse(mostRecentVersion);
      const isMoreRecent = mostRecentDate - subfolderDate < 0;
      if (isMoreRecent) {
        mostRecentVersion = subfolderName;
      }
    }
  }
}
if (!mostRecentVersion) {
  throw new Error(`No versioned data folders found in ${rawDataParentDir}.\nSubfolders of this directory should be named in ISO8601 date format, ie 2017-01-01.`);
}
const srcDir = path.resolve(rawDataParentDir, mostRecentVersion);

const nonSEJson = nonSECutoffsCSVToJSON(path.join(srcDir, 'non-se-cutoff-scores.csv'), path.join(srcDir, 'program-data.csv'))
fs.writeFileSync(path.join(srcDir, 'non-se-cutoff-scores.json'), nonSEJson, 'utf-8')

module.exports = nonSECutoffsCSVToJSON
