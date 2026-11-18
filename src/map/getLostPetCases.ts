import { demoLostPetCases } from './demoLostPetCases.ts'
import type { LostPetCase } from './types.ts'

export function getLostPetCases(): readonly LostPetCase[] {
  return demoLostPetCases
}
