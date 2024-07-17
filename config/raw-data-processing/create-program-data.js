const crypto = require("crypto");

const PROGRAM_CATEGORY_ES = "ES";
const PROGRAM_CATEGORY_HS = "HS";

const isAcademicCenter = (program) => {
  ACADEMIC_CENTER_PROGRAM_TYPES = ["Academic Center", "Selective Enrollment (Academic Center)"]
  return ACADEMIC_CENTER_PROGRAM_TYPES.indexOf(program.Program_Type) > 0;
}

/**
 * Takes as input: 
 *  rawProgramData: array listing all CPS Programs, both elementary school and high school.
 *
 * For the schema of the input rawProgramData array, see ./schema/raw-program-data.json.
 *
 * For the schema of the output js array, see ./schema/processed-data/program-data.json.
 * */
function createProgramData(rawProgramData) {
  // convert the raw program data to the shape the app expects
  try {
    const programData = normalizeProgramData(rawProgramData);
    return programData;
  } catch(e) {
    throw(e);
  }
}


const getCategory = (p) => {
  if (isHSProgram(p)) {
    return PROGRAM_CATEGORY_HS;
  } else if (isESProgram(p)) {
    return PROGRAM_CATEGORY_ES;
  } else {
    return p.Primary_Category;
  }
};

const isESProgram = (program) => {
  if (program.Primary_Category === "ES") {
    return true;
  } else if (program.Primary_Category === "HS") {
    // Academic Centers are ES (6th-8th) grade programs that are held
    // in high schools. So, (confusingly) they are labeled as "HS"
    // because their school is a high school even though the programs
    // are ES programs.
    if (isAcademicCenter(program)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const isHSProgram = (program) => {
  if (program.Primary_Category === "HS") {
    // Academic Centers are ES (6th-8th) grade programs that are held
    // in high schools. So, (confusingly) they are labeled as "HS"
    // because their school is a high school even though the programs
    // are ES programs.
    if (isAcademicCenter(program)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const getHSBoundURL = (p) => {
  const HS_BOUND_BASE_URL = "https://hsbound.org/school/"
  // KNOWN_ABBREVIATIONS is list of words to not convert to title case
  const KNOWN_ABBREVIATIONS = ["TEAM", "UIC", "CCA",];

  // take school short name, in form of 'COLLINS HS'.
  // remove 'HS' from the end of name,
  // and convert name to title case.
  const schoolShortName = p.Short_Name;

  let words = schoolShortName.split(" ");
  // remove 'HS' from end of name
  const lastWord = words[words.length - 1];
  if (lastWord === "HS") {
    words.pop();
  }

  // convert name to title case
  const titleCaseWords = words.map( word => {
    const isAbbreviation = KNOWN_ABBREVIATIONS.indexOf(word) != -1;
    if (isAbbreviation) {
      // do not convert to title case
      return word;
    } else {
      // convert to title case
      const letters = word.toLowerCase().split("");
      letters[0] = letters[0].toUpperCase();
      return letters.join("");
    }
  });

  // replace " " with "-"
  const schoolName = titleCaseWords.join("-");

  return HS_BOUND_BASE_URL + schoolName;
};

function sanitizeRequirementDescriptions(rawProgramData) {
  
  let sanitizedProgramData = Object.assign({}, rawProgramData);

  function sanitize(string) {
    function replaceNonBreakingSpaces(string) {
      return string.replace("\u00a0", " "); 
    }
    string = replaceNonBreakingSpaces(string);
    string = string.trim();
    return string;
  }
  
  sanitizedProgramData.Application_Requirements = sanitize(rawProgramData.Application_Requirements);
  sanitizedProgramData.Program_Selections = sanitize(rawProgramData.Program_Selections);

  return sanitizedProgramData;
}

const uniqueIDFrom = (string) => {
  return crypto.createHash("md5").update(string).digest("hex");
};

const fixProgramTypeMisspellings = (programType) => {
  const misspellings = {
    'Instumental': 'Instrumental',
    'Medial': 'Medical',
    'Theatre': 'Theater'
  };
  Object.keys(misspellings).forEach( misspelling => {
    const correctSpelling = misspellings[misspelling];
    programType = programType.replace(misspelling, correctSpelling);
  });
  return programType;
};

function removeSchoolNameFromProgramType(shortName, longName, programType) {
  if (programType.startsWith(longName)) {
    return programType.split(`${longName} - `).pop();
  }
  if (programType.startsWith(shortName)) {
    return programType.split(`${shortName} - `).pop();
  }
  return programType;
}

function normalizeProgramData(rawProgramData) {

  return rawProgramData.map( rawProgram => {

    const p = sanitizeRequirementDescriptions(rawProgram);
    const programFullName = p.Program_Type;

    p.Program_Type = removeSchoolNameFromProgramType(p.Short_Name, p.Long_Name, p.Program_Type);

    const programName = `${p.Short_Name}: ${p.Program_Type}`;
    const programType = fixProgramTypeMisspellings(p.Program_Type);
    const category = getCategory(p);

    return {
      id: `${p.School_ID}-${programName}`,
      //id: p.Program_Type,
      programName: programName,
      programType: programType,
      programFullName: programFullName,

      schoolNameShort: p.Short_Name,
      schoolNameLong: p.Long_Name,
      schoolID: p.School_ID,
      schoolLocation: {
        latitude: Number.parseFloat(p.School_Latitude),
        longitude: Number.parseFloat(p.School_Longitude)
      },

      category: category,

      cpsPageURL: p.CPS_School_Profile,
      hsBoundURL: getHSBoundURL(p),
      schoolPageURL: p.Website,

      applicationReqDescription: p.Application_Requirements,
      selectionReqDescription: p.Program_Selections,

      applicationReqFnID: uniqueIDFrom(p.Application_Requirements),
      selectionReqFnID: uniqueIDFrom(p.Program_Selections)
    };
  });
};

module.exports = createProgramData;
