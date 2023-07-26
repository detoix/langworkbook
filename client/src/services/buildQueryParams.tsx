const buildQueryParams = (searchParams: URLSearchParams, query: any) => {
  let existingParams = new URLSearchParams(searchParams.toString());

  Object.keys(query).filter(key => query[key]).forEach(key => {
    existingParams.set(key, query[key].toString())
  })

  return existingParams.toString() 
}

export {
  buildQueryParams
}