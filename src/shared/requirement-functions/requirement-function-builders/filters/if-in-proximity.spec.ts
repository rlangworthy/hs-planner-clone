import { expect } from "chai";
import { 
  StudentData,
  Program
} from "../../../../shared/types";

import { CPS_PROXIMITY_LOTTERY_RADIUS_METERS } from "../../constants";
import { computeDestinationPoint } from "geolib";

import { ifInProximity } from "../../../../shared/requirement-functions/requirement-function-builders/filters/if-in-proximity";


describe("ifInProximity hsReqFilter", () => {

  let s: StudentData;
  let p: Program;
  beforeEach( () => {
    s = {
      address: "",
      tier: "",
      geo: {
        latitude: 0,
        longitude: 0
      }
    } as StudentData;

    p = {
      schoolID: "",
      schoolLocation: {
        latitude: 0,
        longitude: 0
      }
    } as Program;
  });


  it("should return true when comparing a student and a program which are within the CPS proximity lottery radius of each other", () => {
    // KENWOOD HS
    p.schoolID = "609746";
    p.schoolLocation = {
      latitude: 41.803772,
      longitude: -87.590421
    }

    // compute a point slightly inside CPS_PROXIMITY_LOTTERY_RADIUS
    const DISTANCE_OFFSET = 100; // meters
    const distance = CPS_PROXIMITY_LOTTERY_RADIUS_METERS - DISTANCE_OFFSET;
    const bearing = 0;
    const destination_geo = computeDestinationPoint(p.schoolLocation, distance, 0);
    s.geo = {
      latitude: destination_geo.latitude,
      longitude: destination_geo.longitude 
    };

    // student should be within proximity
    expect(ifInProximity(s, p)).to.eq(true);
  });

  it("should return false when comparing a student and a program which are outside the CPS proximity lottery radius of each other", () => {
    // KENWOOD HS
    p.schoolID = "609746";
    p.schoolLocation = {
      latitude: 41.803772,
      longitude: -87.590421
    }

    // compute a point slightly outside CPS_PROXIMITY_LOTTERY_RADIUS
    const DISTANCE_OFFSET = 100; // meters
    const distance = CPS_PROXIMITY_LOTTERY_RADIUS_METERS + DISTANCE_OFFSET; 
    const bearing = 0;
    const destination_geo = computeDestinationPoint(p.schoolLocation, distance, 0);
    s.geo = {
      latitude: destination_geo.latitude,
      longitude: destination_geo.longitude 
    };

    // student should not be within proximity
    expect(ifInProximity(s, p)).to.eq(false);
  });

});
