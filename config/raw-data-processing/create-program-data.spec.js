const {expect} = require("chai");

const createProgramData = require("./create-program-data");

describe("createProgramData", () => {

  let mockRawProgramData;
  let mockProgramTypeIDConfig;
  beforeEach( () => {
    mockRawProgramData = [ 
      {
        School_ID: "1",
        Short_Name: "School One",
        Long_Name: "School One for the Arts",
        School_Type: "Neighborhood",
        Primary_Category: "HS",
        CPS_School_Profile: "www.1.com",
        Website: "www.2.com",
        Program_Type: "type1",
        Application_Requirements: "Eat 12 strawberries, if you want",
        Program_Selections: "Everyone who eats 12 berries, if they wanted to, is in.",
        School_Latitude: "1",
        School_Longitude: "1",
      },
      {
        School_ID: "2",
        Short_Name: "School Two",
        Long_Name: "School Two for the Sciences",
        School_Type: "Neighborhood",
        Primary_Category: "HS",
        CPS_School_Profile: "www.2.com",
        Website: "www.2.com",
        Program_Type: "type2",
        Application_Requirements: "Eat 13 strawberries, if you want",
        Program_Selections: "Everyone who got accepted to School One is accepted here.",
        School_Latitude: "2",
        School_Longitude: "2",
      },
    ];
    mockProgramTypeIDConfig = [
      {programTypeID: "type1", name: "type1"},
      {programTypeID: "type2", name: "type2"},
    ];
  });

  it("should assign a unique programID property to each program in the output", () => {
    const programs = createProgramData(mockRawProgramData, mockProgramTypeIDConfig);
    let ids = {};
    const isNotUnique = (program) => {
      if (ids[program.id]) {
        return true; 
      } else {
        ids[program.id] = true;
        return false;
      }
    }
    expect(programs.some(isNotUnique)).to.be.false;
  });


  // NOTE if the wording of this test confuses you, see config/README.txt
  it("should create a unique id for each individual application requirement and selection requirement; these ids should be unique to values of the strings of the applicationReqDescription and selectionReqDescription properties of the outputted data.", () => {
    const programs = createProgramData(mockRawProgramData, mockProgramTypeIDConfig)
    expect(programs[0].applicationReqFnID !== programs[1].applicationReqFnID);
    expect(programs[0].selectionReqFnID !== programs[1].selectionReqFnID);

    // modify mock program data so that application_requirements and program_selections
    // are the same.
    mockRawProgramData[0].Application_Requirements = "foo";
    mockRawProgramData[1].Application_Requirements = "foo";
    mockRawProgramData[0].Selection_Requirements = "bar";
    mockRawProgramData[1].Selection_Requirements = "bar";
    const modifiedPrograms = createProgramData(mockRawProgramData, mockProgramTypeIDConfig)
    expect(programs[0].applicationReqFnID === programs[1].applicationReqFnID);
    expect(programs[0].selectionReqFnID === programs[1].selectionReqFnID);
  });

  it("should accurately parse the school latitude and longitude from strings in rawProgramData to floats in the output data", () => {
    
    const programs = createProgramData(mockRawProgramData, mockProgramTypeIDConfig)
    programs.forEach( (program, i) => {
      expect(program.schoolLocation.latitude).to.not.be.NaN;
      expect(program.schoolLocation.longitude).to.not.be.NaN;

      const originalRawProgram = mockRawProgramData[i];
      const originalLatitude = originalRawProgram.School_Latitude;
      const originalLongitude = originalRawProgram.School_Longitude;

      expect(program.schoolLocation.latitude).to.equal(Number.parseFloat(originalLatitude));
      expect(program.schoolLocation.longitude).to.equal(Number.parseFloat(originalLongitude));
    })
  });

});
