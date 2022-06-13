import { NavigateFunction } from "react-router-dom"

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
  redirectWith
}