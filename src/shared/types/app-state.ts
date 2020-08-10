import {
  AppData,
  ProgramOutcomeDictionary,
  StudentData, 
  ProgramModalState
} from "../../shared/types";

export interface AppState {

  studentData: StudentData

  programOutcomes: ProgramOutcomeDictionary

  loadingStatus: {
    loadingData: boolean
    dataLoaded: boolean
    loadingTier: boolean
    tierLoaded: boolean
  }

  data: AppData

  programModalState: ProgramModalState  
};
