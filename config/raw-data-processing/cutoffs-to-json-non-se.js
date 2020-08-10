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

    cutOffs = d3.nest().key( k => k['school'] + k['programType']).rollup( ks => {
                            const schoolRow = rawSchoolIDs.find( row => row['Short_Name'] === ks[0].school.toUpperCase() )
                            if (schoolRow === undefined) {
                                throw new Error(`Could not find school ${ks[0].school.toUpperCase()}`);
                            }
                            const schoolID = schoolRow['School_ID']
                            return {
                                programID: schoolID + '-' + ks[0]['programType'],
                                school: ks[0]['school'],
                                programType: ks[0]['programType'],
                                cutoffScores: {
                                    min: parseInt(ks[0]['cutoffScores'], 10)
                                }
                            }
                        })
                .object(rawCutOffs)

    return JSON.stringify(Object.values(cutOffs), null, 2)
                        
}

const nonSEJson = nonSECutoffsCSVToJSON(path.join(__dirname, '../raw-data/2019-07-10/non-se-cutoff-scores.csv'), path.join(__dirname, '../../scraper/raw-data/Chicago_Public_Schools_-_School_Profile_Information_SY1819.csv'))
fs.writeFileSync(path.join(__dirname, '../raw-data/2019-07-10/non-se-cutoff-scores.json'), nonSEJson, 'utf-8')

//module.exports = nonSECutoffsCSVToJSON
