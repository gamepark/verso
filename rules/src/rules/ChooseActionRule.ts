import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayCardRule } from './PlayCardRule'
import { RuleId } from './RuleId'

export class ChooseActionRule extends PlayCardRule {
  getPlayerMoves() {
    const cardToPlay = this.cardToPlay
    const moves: MaterialMove[] = super.getPlayerMoves()

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
}
