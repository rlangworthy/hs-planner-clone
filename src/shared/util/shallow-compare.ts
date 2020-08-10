export const shallowCompare = (objA, objB) => {

  if ( Object.keys(objA).some( key => objA[key] !== objB[key] ) ) {
    return false;
  }
  if ( Object.keys(objB).some( key => objA[key] !== objB[key] ) ) {
    return false;
  }

  return true;
}
