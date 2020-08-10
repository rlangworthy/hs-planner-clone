const createUrl = (base: string, queryStrings: Object): URL => {
  let url = new URL(base);
  Object.keys(queryStrings).forEach( key => {
    const value = queryStrings[key];
    // append each query string in queryParams
    url.searchParams.append(key, value);
  });
  return url;
};

export default createUrl;
