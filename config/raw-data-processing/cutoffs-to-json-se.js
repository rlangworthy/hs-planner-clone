const csvParse = require('csv-parse/lib/sync');
const d3 = require('d3')
const fs = require('fs')
const path = require('path')

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
    const rawCutOffs  = csvParse(cutoffScoresCsvFile, {
        columns:true
    })
    const schoolIDsCsvFile = fs.readFileSync(pathToSchoolIDs, 'utf-8')
    const rawSchoolIDs  = csvParse(schoolIDsCsvFile, {
        columns:true
    })

    cutOffs = d3.nest().key(k => k.School)
                        .rollup(ks => {
                            // (mpingram) Forgive me for this code. In the array of {School_ID: , Short_Name: },
                            // find the first element that has a Short_Name that matches our school name.
                            // The short_name is a semistandard name for the school, which usually is in ALL CAPS and
                            // ends in 'HS'. I had to capitalize the school names in the cutoff scores .csv and append
                            // 'HS' to the name to get it to work.
                            const schoolRow = rawSchoolIDs.find( row => row['School_Nm'] === ks[0].School.toUpperCase() + ' HS' )
                            if (schoolRow === undefined) {
                                throw new Error(`Could not find school ${ks[0].School.toUpperCase() + ' HS'}`);
                            }
                            const schoolID = schoolRow['School_ID']
                            if (schoolID === undefined) {
                                throw new Error(`Could not find school ${ks[0].School.toUpperCase() + ' HS'}`);
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

const seJson = seCutoffsCSVtoJSON(path.join(__dirname, '../raw-data/2020-08-03/se-cutoff-scores.csv'), path.join(__dirname, '../../scraper/raw-data/Chicago_Public_Schools_-_School_Locations_SY1920.csv'))
fs.writeFileSync(path.join(__dirname, '../raw-data/2020-08-03/se-cutoff-scores.json'), seJson, 'utf-8')

module.exports=seCutoffsCSVtoJSON
