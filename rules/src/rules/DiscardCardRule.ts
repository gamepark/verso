import { Material, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class DiscardCardRule extends PlayerTurnRule {
  onRuleStart(_move: RuleMove, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove[] {
    const moves: MaterialMove[] = []
    const cardToDiscard: Material = this.cardToDiscard
    moves.push(cardToDiscard.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
    return moves
  }

  get cardToDiscard() {
    return this.material(MaterialType.Card).index(this.remind(Memory.DiscardedCard))
  }
}
