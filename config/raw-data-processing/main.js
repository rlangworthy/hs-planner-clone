const fs = require("fs");
const path = require("path");
const csvParseSync = require("csv-parse/lib/sync");
const jsonschema = require("jsonschema");

const createProgramData = require("./create-program-data");
const createSchoolAttendanceBoundaryTable = require("./create-school-attendance-boundary-table");

const schemaDir = path.resolve(__dirname, "..", "schema");
const rawProgramDataSchema = require(path.resolve(schemaDir, "program-data.json"));
const rawAttendanceBoundariesSchema = require(path.resolve(schemaDir, "raw-attendance-boundaries.json"));
const tractTierTableConfigSchema = require(path.resolve(schemaDir, "tract-tier-table.json"));
const seCutoffScoresSchema = require(path.resolve(schemaDir, "se-cutoff-scores.json"));
const nonSECutoffScoresSchema = require(path.resolve(schemaDir, "non-se-cutoff-scores.json"));

const schoolAttendanceBoundTableSchema = require(path.resolve(schemaDir, "school-attendance-boundary-table.json"));
const hsProgramsSchema = require(path.resolve(schemaDir, "hs-programs.json"));
const nonHSProgramsSchema = require(path.resolve(schemaDir, "non-hs-programs.json"));

// Constants
// ==================
// how many decimal places to round geocoordinates to
const ATTENDANCE_BOUND_COORDINATE_PRECISION = 3; 
// value of rawProgramData.Primary_Category that corresponds to high school or elementary school
const PROGRAM_CATEGORY_ES = "ES";
const PROGRAM_CATEGORY_HS = "HS";

// Raw data filepaths
// ------------------
/**
 * Subfolders in rawDataParentDir are different versions of the raw data
 * folder by date. Subfolders are named in ISO8601 date format, eg 2017-01-01.
 * */
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
console.log(mostRecentVersion)
const INPUT_FILEPATH_RAW_PROGRAM_DATA = path.join(srcDir, "program-data.csv");
//const INPUT_FILEPATH_RAW_ES_ATTENDANCE_BOUND_GEOMETRY = path.join(srcDir, "es-attendance-boundaries.geojson");
const INPUT_FILEPATH_RAW_HS_ATTENDANCE_BOUND_GEOMETRY = path.join(srcDir, "hs-attendance-boundaries.geojson");
const INPUT_FILEPATH_TRACT_TIER_TABLE = path.join(srcDir, "tract-tier-table.json");
const INPUT_FILEPATH_SE_CUTOFF_SCORES = path.join(srcDir, "se-cutoff-scores.json");
const INPUT_FILEPATH_NON_SE_CUTOFF_SCORES = path.join(srcDir, "non-se-cutoff-scores.json");

// Processed data filepaths
// ------------------
const destDir = path.resolve(__dirname, "..", "..", "public", "data");

const OUTPUT_FILEPATH_ATTENDANCE_BOUND_GEOMETRIES = path.join(destDir, "school-attendance-boundary-table.json");
const OUTPUT_FILEPATH_TRACT_TIER_TABLE = path.join(destDir, "tract-tier-table.json");
const OUTPUT_FILEPATH_SE_CUTOFF_SCORES = path.join(destDir, "se-cutoff-scores.json");
const OUTPUT_FILEPATH_NON_SE_CUTOFF_SCORES = path.join(destDir, "non-se-cutoff-scores.json");
const OUTPUT_FILEPATH_HS_PROGRAMS = path.join(destDir, "hs-programs.json");
const OUTPUT_FILEPATH_NON_HS_PROGRAMS = path.join(destDir, "non-hs-programs.json");

// ==================

function buildAll() {
  
  buildSchoolAttendanceBoundaryTable();
  buildTractTierTable();
  buildCutoffScores();
  buildProgramData();

}

function buildSchoolAttendanceBoundaryTable() {
  const rawHSAttendanceBoundGeojson = JSON.parse(fs.readFileSync(INPUT_FILEPATH_RAW_HS_ATTENDANCE_BOUND_GEOMETRY, "utf-8"));
  validateOrThrow(rawHSAttendanceBoundGeojson, rawAttendanceBoundariesSchema);

  const schoolAttendanceBoundTable = createSchoolAttendanceBoundaryTable(rawHSAttendanceBoundGeojson, ATTENDANCE_BOUND_COORDINATE_PRECISION);
  validateOrThrow(schoolAttendanceBoundTable, schoolAttendanceBoundTableSchema);

  fs.writeFileSync(OUTPUT_FILEPATH_ATTENDANCE_BOUND_GEOMETRIES, JSON.stringify(schoolAttendanceBoundTable), "utf-8");
}

function buildTractTierTable() {
  const tractTierTable = JSON.parse(fs.readFileSync(INPUT_FILEPATH_TRACT_TIER_TABLE, "utf-8"));
  validateOrThrow(tractTierTable, tractTierTableConfigSchema);

  fs.copyFileSync(INPUT_FILEPATH_TRACT_TIER_TABLE, OUTPUT_FILEPATH_TRACT_TIER_TABLE);
}

function buildCutoffScores() {
  const seCutoffScoresConfig = JSON.parse(fs.readFileSync(INPUT_FILEPATH_SE_CUTOFF_SCORES, "utf-8"));
  const nonSECutoffScoresConfig = JSON.parse(fs.readFileSync(INPUT_FILEPATH_NON_SE_CUTOFF_SCORES, "utf-8"));
  validateOrThrow(seCutoffScoresConfig, seCutoffScoresSchema);
  validateOrThrow(nonSECutoffScoresConfig, nonSECutoffScoresSchema);

  // convert both se cutoff scores and non-se cutoff scores into a table relating program id to 
  // cutoff score. Throw if duplicate ids are encountered.
  
  let seCutoffScores = {};
  seCutoffScoresConfig.forEach( record => {
    // if this program id is already in the output, we have a duplicate id
    if (seCutoffScores[record.programID] !== undefined) {
      throw new Error(`Error: duplicate programID ${record.programID} in the selective enrollment cutoff scores config!`);
    }
    seCutoffScores[record.programID] = record.tieredCutoffScores;
  });
  
  let nonSECutoffScores = {};
  nonSECutoffScoresConfig.forEach( record => {
    // if this program id is already in the output, we have a duplicate id
    if (nonSECutoffScores[record.programID] !== undefined) {
      throw new Error(`Error: duplicate programID ${record.programID} in the non-selective-enrollment cutoff scores config!`);
    }
    nonSECutoffScores[record.programID] = record.cutoffScores;
  });
  console.log(OUTPUT_FILEPATH_SE_CUTOFF_SCORES)
  fs.writeFileSync(OUTPUT_FILEPATH_SE_CUTOFF_SCORES, JSON.stringify(seCutoffScores), "utf-8");
  fs.writeFileSync(OUTPUT_FILEPATH_NON_SE_CUTOFF_SCORES, JSON.stringify(nonSECutoffScores), "utf-8");
}

function buildProgramData() {
  const rawProgramDataCsv = fs.readFileSync(INPUT_FILEPATH_RAW_PROGRAM_DATA, "utf-8");  
  // parse csv file into js object
  const rawProgramData = csvParseSync(rawProgramDataCsv, {columns: true});
  validateOrThrow(rawProgramData, rawProgramDataSchema);
  let programData;
  try {
    programData = createProgramData(rawProgramData);
  } catch(e) {
    throw(e);
  }
  // separate out high school programs and other programs
  let hsPrograms = [];
  let nonHSPrograms = [];
  programData.forEach( program => {
    if (program.category === PROGRAM_CATEGORY_HS) {
      hsPrograms.push(program);
    } else {
      nonHSPrograms.push(program);
    }
  });

  validateOrThrow(hsPrograms, hsProgramsSchema);
  validateOrThrow(nonHSPrograms, nonHSProgramsSchema);
  
  fs.writeFileSync(OUTPUT_FILEPATH_HS_PROGRAMS, JSON.stringify(hsPrograms), "utf-8");
  fs.writeFileSync(OUTPUT_FILEPATH_NON_HS_PROGRAMS, JSON.stringify(nonHSPrograms), "utf-8");
}


function validateOrThrow(json, schema) {
  const validationResult = jsonschema.validate(json, schema);
  if (validationResult.errors.length !== 0) {
    throw new Error(validationResult);  
  } else {
    return;
  }
}

/* 
 * Run all build scripts.
 * */
buildAll();
console.log('We did it!')
