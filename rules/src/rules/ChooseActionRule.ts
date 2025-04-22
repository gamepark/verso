import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { PlayCardRule } from './PlayCardRule'
import { RuleId } from './RuleId'

export class ChooseActionRule extends PlayCardRule {
  getPlayerMoves() {
    const cardToPlay = this.cardToPlay
    const moves: MaterialMove[] = super.getPlayerMoves()

    if (new PlayerLayoutHelper(this.game, this.player).atLeastOneColorAsSequence()) {
      moves.push(this.customMove(CustomMoveType.BankSequence))
    }

    moves.push(cardToPlay.rotateItem((item) => !item.location.rotation))
    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = super.afterItemMove(move)
    if (isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.Deck) {
      moves.push(this.startRule(RuleId.PlayCard))
    }

    return moves
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.BankSequence)(move)) {
      return [this.startRule(RuleId.BankSequence)]
    }
    return []
  }
}
