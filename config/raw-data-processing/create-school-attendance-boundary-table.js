/**
 * buildSchoolAttendanceBoundTable takes as input a geoJSON object which
 * describes the attendance boundaries of CPS programs.
 *
 * The function takes a second optional paramter, coordinatePrecision,
 * which is an integer specifying the number of decimal places that the 
 * geocoordinates of the output should be precise to. If no argument is
 * passed to coordinatePrecision, the precision of the coordinates is not
 * adjusted from the original geoJSON file.
 *
 * The function outputs a javascript object of the shape:
 * {
 *    [schoolID: string]: [number, number][] 
 * }
 * The array of number pairs represents the geometry of the school's attendance
 * boundary.
 * */
function createSchoolAttendanceBoundaryTable(attendBoundGeojson, coordinatePrecision) {
  if (coordinatePrecision !== undefined) {
    if (typeof coordinatePrecision !== "number") {
      throw new Error("Incorrect parameters passed to createSchoolAttendanceBoundaryTable.");
    }
  }

  // HACK: deep clone attendBoundGeojson so that this mutation-happy code does not
  // mutate the arguments passed to it. (!)
  let geojson = JSON.parse(JSON.stringify(attendBoundGeojson));

  //sanitize geojson to make MultiPolygons of each feature, super hacky
  let features = geojson.features;
  features.forEach(feature => {
    if(feature.geometry.type == 'Polygon'){
      feature.geometry.coordinates = [feature.geometry.coordinates]
    }
    if(feature.geometry.type == 'GeometryCollection'){
      let geometries = feature.geometry.geometries
      feature.geometry.coordinates = feature.geometry.geometries.filter(geo => geo.type == 'Polygon').map(geo => geo.coordinates)
      //console.log(feature.geometry.coordinates)  
    }
  })
  //});

  //console.log(Object.keys(geojson.features[0].geometry.coordinates))
  //console.log(geojson.features[311].geometry.coordinates[0][0])
  // if coordinate precision is specified, reduce precision of coordinates
  // of each geojson object
  if (coordinatePrecision !== undefined) {
    // reduceGeojson mutates its parameters. (I know, I know.)
    reduceGeojsonPrecision(geojson, coordinatePrecision);
  } 
  //console.log(Object.keys(geojson.features[311].geometry.coordinates[0][0]))
  //console.log(geojson.features[311].geometry.coordinates[0][0])
  //console.log(geojson.features[311].properties.SCHOOL_ID)


  let output = {};
  // Each feature in the geoJSON object's 'features' property describes
  // one school.
  const schools = geojson.features;
  // Add the school's geometry to the output object keyed by school ID.
  schools.forEach( school => {
    //console.log(school.properties.SCHOOL_ID)
    //console.log(school.geometry.coordinates[0][0])
    output[school.properties.SCHOOL_ID] = school.geometry.coordinates;
  });

  return output;
}


/* 
 * Polyfilled rounding function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#A_better_solution
 * to avoid floating point arithmetic issues / lack of decimal rounding in js standard lib
 * */
function round(number, precision) {
  var shift = function (number, precision) {
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, +precision)), -precision);
}

/*
 * Reduces precision of the coordinates in a geojson object.
 * NOTE: mutates the original geojson object.
 * */
function reduceGeojsonPrecision(geojson, decimalPrecision) {

  function setPrecision(coords, precision) {
    coords = coords.map( coordPair => [
        round(coordPair[0], precision), 
        round(coordPair[1], precision)
      ] 
    );
    // remove any repeated coordinates that may have been
    // created by reducing precision
    coords = coords.filter( (coordPair, i, arr) => {
      if (i > 0) {
        const prevCoordPair = arr[i - 1];
        if (prevCoordPair[0] === coordPair[0] && prevCoordPair[1] === coordPair[1]) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } );

    return coords;
  }

  // iterate through the geojson coordinates and reduce their precision
  const features = geojson["features"];
  geojson["features"] = features.map( feature => {
    if (feature["geometry"]["coordinates"]){
      const coords = feature["geometry"]["coordinates"][0][0];
      feature["geometry"]["coordinates"] = setPrecision(coords, decimalPrecision);
      return feature;
    }
    return feature
  });
}

//const fs = require("fs");

//current = './raw-data/2026-08-04/hs-attendance-boundaries.geojson'
//const curRaw = JSON.parse(fs.readFileSync(current, "utf-8"));
//let curgeojson = JSON.parse(JSON.stringify(curRaw))
//console.log('old ' + Object.keys(oldgeojson.features[1].geometry.coordinates[0]))
//console.log('new ' + Object.keys(curgeojson.features[311]))
//console.log(curgeojson.features[65].geometry)

//const schoolAttendanceBoundTable = createSchoolAttendanceBoundaryTable(curRaw, 3);
  module.exports = createSchoolAttendanceBoundaryTable;
