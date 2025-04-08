import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class DrawCardRule extends PlayerTurnRule {
  onRuleStart() {
    const cards = this.deckCards
    const moves: MaterialMove[] = []
    moves.push(
      cards.moveItem((item) => ({
        type: LocationType.PlayerHand,
        rotation: item.location.rotation,
        player: this.player
      }))
    )

    moves.push(this.startRule(RuleId.PlayCard))

    return moves
  }

  get deckCards() {
    return this.material(MaterialType.Card).location(LocationType.Deck)
  }
}
