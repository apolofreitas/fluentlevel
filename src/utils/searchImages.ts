const API_KEY = '563492ad6f91700001000001b51341ebfd7d444c824c0c63e94e1b3a'

export interface Picture {
  id: number
  src: { original: string; large: string; small: string; tiny: string }
}

export interface JsonPexelsAPI {
  photos: Picture[]
  page: number
  per_page: number
  total_results: number
}

export async function fetchImages(uri: string) {
  return await fetch(uri, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: API_KEY },
  }).then(function (response) {
    return response.json()
  })
}

export async function searchImages(search: string) {
  const data: JsonPexelsAPI = await fetchImages(
    `https://api.pexels.com/v1/search?query=${search}&page=1&per_page=20&locale=pt-BR`,
  )
  return data
}
