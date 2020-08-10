import { MILE_METER_CONVERSION_FACTOR } from "../../../shared/constants";

export const CPS_PROXIMITY_LOTTERY_RADIUS_MI = 2.5; // miles
export const CPS_PROXIMITY_LOTTERY_RADIUS_METERS = CPS_PROXIMITY_LOTTERY_RADIUS_MI * MILE_METER_CONVERSION_FACTOR;
export const POINT_SYSTEM_UNCERTAINTY_THRESHOLD = 2;

export * from "./cps-es-program-ids";

