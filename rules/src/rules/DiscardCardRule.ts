import { isMoveItem, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayCardRule } from './PlayCardRule'

export class DiscardCardRule extends PlayerTurnRule {
  onRuleStart() {
    return [this.cardToDiscard.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation }))]
  }

  get cardToDiscard() {
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .maxBy((item) => item.location.x!)
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (isMoveItem(move) && move.location.type === LocationType.Discard) {
      return [new PlayCardRule(this.game).endPlayerTurn()]
    }
    return []
  }
}
