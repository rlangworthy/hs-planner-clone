export interface RawProgram {
  id: string

  schoolNameShort: string
  schoolNameLong: string
  schoolID: string
  schoolLocation: {
    latitude: number,
    longitude: number
  }

  programName: string
  programType: string
  programTypeID: string
  category: string

  cpsPageURL: string
  hsBoundURL: string
  schoolPageURL: string

  applicationReqDescription: string
  selectionReqDescription: string

  applicationReqFnID: string,
  selectionReqFnID: string
}
