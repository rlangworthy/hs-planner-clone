import { 
  StudentData,
  Program 
} from "../../shared/types";

export type ReqFnFilter = (student: StudentData, program: Program) => boolean;
