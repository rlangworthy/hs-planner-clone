const {expect} = require("chai");

const createSchoolAttendanceBoundaryTable = require("./create-school-attendance-boundary-table");

// higher-order function that creates a function which rounds
// a number to decPlaces decimal places.
const createRoundingFn = (precision) => (num) => {
  var shift = function (num, precision) {
    var numArray = ("" + num).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(num, +precision)), -precision);
};

describe("createSchoolAttendanceBoundaryTable", () => {

  let mockAttendBoundGeojson;

  beforeEach( () => {
    mockAttendBoundGeojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            school_id: "1",
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [[[
              [-87.72651800686133,41.915450412533396],
              [-87.72651026186018,41.91534379873655],
              [-87.72631492323966,41.91534733637229],
              [-87.72589356939818,41.91535096934249],
              [-87.72588880159381,41.915351009844905],
              [-87.7253912770089, 41.915356088186044],
              [-87.7252844194228, 41.91535835934488]
            ]]]
          }
        },
        {
          type: "Feature",
          properties: {
            school_id: "2",
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [[[
              [-87.72651800686133,41.915450412533396],
              [-87.72651026186018,41.91534379873655],
              [-87.72631492323966,41.91534733637229],
              [-87.72589356939818,41.91535096934249],
              [-87.72588880159381,41.915351009844905],
              [-87.7253912770089, 41.915356088186044],
              [-87.7252844194228, 41.91535835934488]
            ]]]
          }
        }
      ]
    };
  });

  /*
   * Handling incorrect inputs.
   * */
  xit("should throw if input object does not match expected shape", () => {
    // positive test
    // negative test
  });

  it("should throw if optional coordinatePrecision parameter is passed and is not a number", () => {
    const incorrectCoordPrecA = "9";
    const incorrectCoordPrecB = [];
    const incorrectCoordPrecC = null;

    const correctCoordPrec = 2;

    // positive test
    expect( () => createSchoolAttendanceBoundaryTable(mockAttendBoundGeojson, incorrectCoordPrecA) ).to.throw();
    expect( () => createSchoolAttendanceBoundaryTable(mockAttendBoundGeojson, incorrectCoordPrecB) ).to.throw();
    expect( () => createSchoolAttendanceBoundaryTable(mockAttendBoundGeojson, incorrectCoordPrecC) ).to.throw();
    // negative test
    expect( () => createSchoolAttendanceBoundaryTable(mockAttendBoundGeojson, correctCoordPrec) ).not.to.throw();
    expect( () => createSchoolAttendanceBoundaryTable(mockAttendBoundGeojson) ).not.to.throw();
  });
  
  /*
   * Normal functioning.
   * */
  it("should produce an object relating school ids to an array of coordinate pairs", () => {
    const output = createSchoolAttendanceBoundaryTable(mockAttendBoundGeojson);

    // for each feature in mock input geojson, expect there to be an entry 
    // in the output table with the same coordinates.
    const features = mockAttendBoundGeojson.features;
    features.forEach( feature => {
      expect( output[feature.properties.school_id] ).to.deep.equal(feature.geometry.coordinates);
    });
  });

  describe("coordinate rounding behavior", () => {

    it("should round coordinates to the number of decimal places equal to the coordinatePrecision parameter", () => {

      const mockGeojsonSixDigitPrecisionNoDuplicates = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              school_id: "1",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[
                [-87.726518, 41.915450],
                [-87.726510, 41.915343],
                [-87.726610, 41.915347],
                [-87.725893, 41.915350],
                [-87.725388, 41.916351],
                [-87.725391, 41.915356],
                [-87.725284, 41.915558]
              ]]]
            }
          },
          {
            type: "Feature",
            properties: {
              school_id: "2",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[
                [-87.726518, 41.915450],
                [-87.726510, 41.915343],
                [-87.726610, 41.915347],
                [-87.725893, 41.915350],
                [-87.725388, 41.916351],
                [-87.725391, 41.915356],
                [-87.725284, 41.915558]
              ]]]
            }
          }
        ]
      };

      
      const coordPrec = 5;
      const output = createSchoolAttendanceBoundaryTable(mockGeojsonSixDigitPrecisionNoDuplicates, coordPrec);

      // for each feature in mock input geojson, expect there to be an entry 
      // in the output table with the same coordinates rounded to the correct number
      // of decimal places.
      const features = mockGeojsonSixDigitPrecisionNoDuplicates.features;
      features.forEach( feature => {
        // positive test
        const roundCoordPair = coordPair => {
          const round = createRoundingFn(coordPrec);
          return [
            round(coordPair[0]), 
            round(coordPair[1])
          ];
        } 
        const coordinates = feature.geometry.coordinates[0][0]
        const roundedCoords = coordinates.map(roundCoordPair);
        expect( output[feature.properties.school_id] ).to.deep.equal(roundedCoords);

        // negative test
        const incorrectRoundCoordPair = coordPair => {
          const round = createRoundingFn(coordPrec - 1);
          return [
            round(coordPair[0]), 
            round(coordPair[1])
          ];
        }
        const incorrectRoundedCoords = coordinates.map(incorrectRoundCoordPair);
        expect( output[feature.properties.school_id] ).not.to.deep.equal(incorrectRoundedCoords);
      });
    });

    xit("should not alter coordinates if the coordinate precision is set higher than current coordinate precision", () => {
      const coordPrec = 99;
      const output = createSchoolAttendanceBoundaryTable(mockAttendBoundGeojson, coordPrec);

      // for each feature in mock input geojson, expect there to be an entry 
      // in the output table with the same coordinates.
      const features = mockAttendBoundGeojson.features;
      features.forEach( feature => {
        const expectedCoordinates = feature.geometry.coordinates[0][0];
        expect( output[feature.properties.school_id] ).to.deep.equal(expectedCoordinates);
      });
    });

    it("should omit duplicated coordinates in the output if the two duplicated coordinates are next to one another", () => {
      
      const mockGeojsonWithDuplicateAt5DecimalPlaces = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              school_id: "1",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[
                [-87.726518, 41.915450],
                [-87.725893, 41.915350],
                [-87.725388, 41.916351],
                [-87.725391, 41.915356],
                [-87.725284, 41.915558],
                /* here's the duplicate: features[0].geometry.coordinates[1] */
                [-87.726510, 41.915346],
                [-87.726510, 41.915347],
                /* -------------------- */
              ]]]
            }
          },
        ]
      };

      const coordPrec = 5;
      const round = createRoundingFn(coordPrec);
      const roundCoordPair = coordPair => {
        return [
          round(coordPair[0]), 
          round(coordPair[1])
        ];
      };
      const feature = mockGeojsonWithDuplicateAt5DecimalPlaces.features[0];

      // last coordinate in feature is now duplicated; remove it
      const coordinates = feature.geometry.coordinates[0][0];
      const expectedCoordinates = coordinates.slice(0,-1).map(roundCoordPair);

      const output = createSchoolAttendanceBoundaryTable(mockGeojsonWithDuplicateAt5DecimalPlaces, coordPrec);
      expect( output[feature.properties.school_id] ).to.deep.equal(expectedCoordinates);
    });

    it("should retain duplicated coordinates that are not next to one another; these duplicated coordinates are not caused by loss of precision", () => {

      const mockGeojsonWithNonContiguousDuplicate = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              school_id: "1",
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[
                [-87.726518, 41.915450],
                [-87.725893, 41.915350],
                /* this coordinate will be the same as the final one */
                [-87.726510, 41.915346],
                /* -------------------- */
                [-87.725388, 41.916351],
                [-87.725391, 41.915356],
                [-87.725284, 41.915558],
                /* This cooridnate will be the same as the third one */
                [-87.726510, 41.915347],
                /* -------------------- */
              ]]]
            }
          },
        ]
      };

      const coordPrec = 5;
      const round = createRoundingFn(coordPrec);
      const roundCoordPair = coordPair => {
        return [
          round(coordPair[0]), 
          round(coordPair[1])
        ];
      };
      const feature = mockGeojsonWithNonContiguousDuplicate.features[0];
      const coordinates = feature.geometry.coordinates[0][0];
      const expectedCoordinates = coordinates.map(roundCoordPair);
      const output = createSchoolAttendanceBoundaryTable(mockGeojsonWithNonContiguousDuplicate, coordPrec);

      expect( output[feature.properties.school_id] ).to.deep.equal(expectedCoordinates);
    });

  });
});
