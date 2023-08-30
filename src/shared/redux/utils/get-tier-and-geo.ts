import * as JSONP from "browser-jsonp";
import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';

import { store } from "../../../shared/redux/store";
import pointInPolygon from "../../../shared/util/point-in-polygon";

const getTractTierTable = () => store.getState().data.tractTierTable;

export const GetTierError = {
  InvalidAddressErr: new Error("Invalid address"),
  NoTierFoundErr: new Error("No CPS tier found for this address"),
  RequestFailedErr: new Error("Request Failed"),
};

export interface TierAndGeoResponse {
  tier: string
  geo: {latitude: number, longitude: number}
};


/*
 * Takes a Chicago street address (e.g. 4747 S Marshfield Ave) and returns a promise
 * that either returns the address' geolocation and CPS tier, or returns one of the
 * three GetTierErrors defined in this module.
 * */
export const getTierAndGeo = (streetAddress: string): Promise<TierAndGeoResponse> => {

  const address = streetAddress.trim() + " , Chicago IL";

  return new Promise((resolve, reject) => {
    getTractAndGeo(address).then( ({tract, geo}) => {
      // we actually don't need the tract anymore, only the geo
      // TODO decide whether to remove the tract entirely
      lookupTierFromGeo(geo).then( tier => {
        resolve({tier, geo});
      }).catch( err => reject(GetTierError.NoTierFoundErr));
    }).catch( err => {
      console.error(err);
      reject(err);
    });
  });
};

interface GeocodingAPIParams {
  address: string
  format: "json" | "csv" | "jsonp"
  benchmark: string
  vintage: string
  layers: string
};

interface GeocodingAPIResponse {
  result: {
    addressMatches: GeocodingAddressMatch[]
  }
}

interface GeocodingAddressMatch {
  coordinates: {x: number, y: number}
  geographies:{
    "Census Tracts": [{
      TRACT: string,
      BASENAME: string
    }]
  }
}

const getTractAndGeo = (address: string): Promise<{tract: string, geo: {latitude: number, longitude: number}}> => {
  const API_BASE_URL = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";
  const apiParams: GeocodingAPIParams = {
    address: address,
    format: "jsonp",
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    layers: "Census Tracts",
  };



  const sendRequest = (baseUrl: string, params: GeocodingAPIParams): Promise<GeocodingAPIResponse> => {
    return new Promise( (resolve, reject) => {
      JSONP({
        url: baseUrl,
        data: params,
        success: (data: GeocodingAPIResponse) => resolve(data),
        error: (err) => {
          reject(GetTierError.RequestFailedErr)
        }
      });
    });
  };

  const extractTract = (response: GeocodingAPIResponse): string => {
    return response.result.addressMatches[0].geographies["Census Tracts"][0].BASENAME;
  };

  const extractGeo = (response: GeocodingAPIResponse): {latitude: number, longitude: number} => {
    const coords = response.result.addressMatches[0].coordinates;
    return {latitude: coords.y, longitude: coords.x};
  };

  return new Promise( (resolve, reject) => {
    sendRequest(API_BASE_URL, apiParams).then( res => {
      const tract = extractTract(res);
      const geo = extractGeo(res);
      resolve({tract, geo});
    }).catch( e => reject(e));
  });
};

const lookupTierFromTract = (tract: string): Promise<string> => {
  return new Promise( (resolve, reject) => {
      const tier: string = getTractTierTable()[tract];
      if (tier === undefined) {
        reject(GetTierError.NoTierFoundErr);
      } else {
        resolve(tier);
      }
  });
};

const lookupTierFromGeo = (geo: { latitude: number, longitude: number }): Promise<string> => {
  let url = "https://api.cps.edu/maps/CPS/GeoJSON?mapName=TIER";

  // TODO better type annotation for this promise
  // I don't know the type for geojson objects
  let sendRequest = (baseUrl: string): Promise<any> => {
    return new Promise( (resolve, reject) => {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: baseUrl
      }
      axios(config).then((data: AxiosResponse) => {
        console.log('loaded map');
        resolve(data)
      }).catch(err => reject(GetTierError.RequestFailedErr))
    });
  };

  return new Promise( (resolve, reject) => {    
    sendRequest(url).then(res => {
      let lst = res.data.features;
      for (let i = 0; i < lst.length; i++) {
        let feature = lst[i];
        let point: [ number, number ] = [ geo.longitude, geo.latitude ];
        // the geojson features are either a single polygon (handled here)
        // or a linestring and two polygons (handled in the else)
        if (feature.geometry.coordinates) {
          if (pointInPolygon(point, feature.geometry.coordinates[0])) {
            resolve(feature.properties.Tier);
            return;
          }
        }
        else {
          if (pointInPolygon(point, feature.geometry.geometries[1].coordinates[0]) ||
              pointInPolygon(point, feature.geometry.geometries[2].coordinates[0])) {
            resolve(feature.properties.Tier);
            return;
          }
        }
      }
      reject(GetTierError.NoTierFoundErr);
    }).catch(err => reject(err));
  })
}