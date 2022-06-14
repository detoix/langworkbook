import { NavigateFunction } from "react-router-dom"

const concatQuery = (searchParams: URLSearchParams, query: any) => {
  let existingParams = new URLSearchParams(searchParams.toString());

  Object.keys(query).forEach(key => {
    existingParams.set(key, query[key].toString())
  })

  return existingParams.toString() 
}

const redirectWith = (
  searchParams: URLSearchParams,
  setSearchParams: any,
  navigate: NavigateFunction,
  query: any
  ) => {

  let params = new URLSearchParams(searchParams.toString());

  Object.keys(query).forEach(key => {
    params.set(key, query[key].toString())
  })

  setSearchParams(params.toString());
  navigate({ search: params.toString() })
}

export {
  concatQuery,
  redirectWith
}