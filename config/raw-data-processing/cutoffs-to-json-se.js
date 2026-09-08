import { parse } from "csv-parse/sync";
import * as d3 from "d3"
import * as fs from "fs"
import * as path from "path"

const MAX_SE_SCORE = '900'
const SE_PROGRAM_TYPE = 'Selective Enrollment High School'

/* 
 * Converts a .csv version of the non-SE cutoff scores to JSON.
 * Takes a path to two .csv files, one being a list matching SE programs to their cutoff scores,
 * and the other being a list matching SE programs to their school IDs.
 * The expected format of the SE programs cutoff scores .csv is
 *
 * School | Selection Method | Min | Mean | Max
 * -------+------------------+-----+------+------
 *
 * Where one row represents one selection method for a SE school
 * (where selection method is Rank, Tier 1, Tier 2, Tier 3, or Tier 4,
 * and where the rows are always in order from Rank -> Tier 4)
 * 
 * The expected format of the school IDS .csv is 
 * School_ID | Short_Name |
 * ----------+------------+
 **/
function seCutoffsCSVtoJSON(pathToCutoffScores, pathToSchoolIDs){
    const cutoffScoresCsvFile = fs.readFileSync(pathToCutoffScores, 'utf-8')
    const rawCutOffs  = parse(cutoffScoresCsvFile, {
        columns:true
    })
    const schoolIDsCsvFile = fs.readFileSync(pathToSchoolIDs, 'utf-8')
    const rawSchoolIDs  = parse(schoolIDsCsvFile, {
        columns:true
    })

    const cutOffs = d3.nest().key(k => k.School)
                        .rollup(ks => {
                            // (mpingram) Forgive me for this code. In the array of {School_ID: , Short_Name: },
                            // find the first element that has a Short_Name that matches our school name.
                            // The short_name is a semistandard name for the school, which usually is in ALL CAPS and
                            // ends in 'HS'. I had to capitalize the school names in the cutoff scores .csv and append
                            // 'HS' to the name to get it to work.
                            const schoolRow = rawSchoolIDs.find( row => row['Short_Name'] === ks[0].School.toUpperCase())
                            if (schoolRow === undefined) {
                                throw new Error(`Could not find school ${ks[0].School.toUpperCase()}`);
                            }
                            const schoolID = schoolRow['School_ID']
                            if (schoolID === undefined) {
                                throw new Error(`Could not find school ${ks[0].School.toUpperCase()}`);
                            }
                            return {
                                school: ks[0].School,
                                programID: schoolID + '-' + SE_PROGRAM_TYPE,
                                programType: SE_PROGRAM_TYPE,
                                tieredCutoffScores: d3.nest().key(k => k['Selection Method'].split(' ').join('').toLowerCase())
                                                            .rollup(rs => {
                                                                return {
                                                                    min: parseInt(rs[0]['Min'], 10),
                                                                    avg: parseInt(rs[0]['Mean'],10),
                                                                    // some 'Max' entries are blank - in that case, use highest possible score as max cutoff score
                                                                    max: parseInt(rs[0]['Max'] != '' ? rs[0]['Max'] : MAX_SE_SCORE,10)
                                                                }
                                                            }).object(ks)
                            }
                        }).object(rawCutOffs)

    return JSON.stringify(Object.values(cutOffs), null, 2)

}


const rawDataParentDir = "../raw-data"
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


const seJson = seCutoffsCSVtoJSON(path.join(srcDir, 'se-cutoff-scores.csv'), path.join(srcDir, 'program-data.csv'))
fs.writeFileSync(path.join(srcDir, 'se-cutoff-scores.json'), seJson, 'utf-8')