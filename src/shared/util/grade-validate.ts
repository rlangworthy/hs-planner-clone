export const isValidHsat = (value) => {
  return typeof value === "number" && 1 <= value && value <=  99;
};

export const isValidCombinedHsat = (value) => {
  return typeof value === "number" && 2 <= value && value <=  198;
};

export const isValidGPA = (value) => {
  return typeof value === "number" && 0 <= value && value <= 4.0;
};

export const isValidAttendance = (value) => {
  return typeof value === "number" && 0 <= value && value <= 100;
};

