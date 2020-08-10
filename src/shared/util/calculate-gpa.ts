import { LetterGrade } from "../../shared/types";

const toPoints = (letterGrade): number => {
  switch(letterGrade){
    case "A":
      return 4;
    case "B":
      return 3;
    case "C":
      return 2;
    case "D":
      return 1;
    case "F":
      return 0;
    default:
      throw new Error(`Unexpected letter grade: ${letterGrade}`);
  }
}

type NullableLetterGrade = LetterGrade | null
const calculateGPA = (...letterGrades: NullableLetterGrade[]): number | null => {
  const numGrades = letterGrades.length;
  let gradePointSum = 0;
  
  // convert each letter grade to points from 0 to 4.
  for (let i=0; i < letterGrades.length; i++) {
    const letterGrade = letterGrades[i];

    // if any letter grades are null, return early with null.
    if (letterGrade === null) {
      return null;
    }

    const points = toPoints(letterGrade);
    gradePointSum += points;
  }
  // average the points from each letter grade.
  return gradePointSum / numGrades;
};

export default calculateGPA;
