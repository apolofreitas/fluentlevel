import { compareTwoStrings } from 'string-similarity'

export function calculateStringSimilarity(firstString: string, secondString: string) {
  return compareTwoStrings(firstString.toLocaleLowerCase(), secondString.toLocaleLowerCase())
}
