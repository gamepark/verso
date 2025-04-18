import { isMoveItem, ItemMove, Material, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class DiscardCardRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const cardToDiscard: Material = this.cardToDiscard
    moves.push(cardToDiscard.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    const moves: MaterialMove[] = []
    if (isMoveItem(move) && move.location.type === LocationType.Discard) {
      if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
        this.memorize(Memory.PlayerEndedGame, this.player)
      }
      if (this.remind(Memory.PlayerEndedGame)) {
        moves.push(this.startPlayerTurn(RuleId.BankLastSequence, this.nextPlayer))
      } else {
        if (this.game.players.length === 1) {
          moves.push(this.startRule(RuleId.SimulateOtherPlayer))
        } else {
          moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
        }
      }
    }
    return moves
  }

  get cardToDiscard() {
    return this.material(MaterialType.Card).index(this.remind(Memory.DiscardedCard))
  }
}
