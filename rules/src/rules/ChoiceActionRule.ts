import { PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'

export class ChoiceActionRule extends PlayerTurnRule {
  onRuleStart() {
    console.log('ChoiceActionRule.onRuleStart')
    console.log(this.playerCards.entries[0])
    return []
  }

  get playerCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }
}
