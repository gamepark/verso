import { useRules } from '@gamepark/react-game'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { VersoRules } from '@gamepark/verso/VersoRules'

export const StackSpotCounter = () => {
  const rules = useRules<VersoRules>()!
  const count = rules.material(MaterialType.Card).location(LocationType.Deck).length
  if (count === 0) return null
  return <span>{count}</span>
}
