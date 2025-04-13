import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerWithoutConsequencesRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    moves.push(this.cardToPlay.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    moves.push(this.startRule(RuleId.ChooseAction))
    return moves
  }

  get cardToPlay() {
    const length = this.material(MaterialType.Card).location(LocationType.Deck).length
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .index(length - 1)
  }
}
