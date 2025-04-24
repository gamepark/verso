import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { PlayCardRule } from './PlayCardRule'
import { RuleId } from './RuleId'

export class ChooseActionRule extends PlayCardRule {
  onRuleStart() {
    return [] // Prevent super.onRuleStart
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = [this.card.rotateItem((item) => !item.location.rotation)]
    if (!this.playerAlreadyHaveFace) {
      moves.push(this.moveCardToPlayerLayout())
    }
    if (new PlayerLayoutHelper(this.game).canMakeSequence()) {
      moves.push(this.customMove(CustomMoveType.BankSequence))
    }
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
