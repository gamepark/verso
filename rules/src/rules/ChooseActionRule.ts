import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { FaceColor } from '../material/Face'
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

    const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
    const skySuite = playerLayoutHelper.checkSuite(FaceColor.Sky)
    const landSuite = playerLayoutHelper.checkSuite(FaceColor.Land)
    const seaSuite = playerLayoutHelper.checkSuite(FaceColor.Sea)

    if (skySuite) {
      moves.push(this.customMove(CustomMoveType.BankSequence, skySuite.maxInSuite))
    }

    if (seaSuite) {
      moves.push(this.customMove(CustomMoveType.BankSequence, seaSuite.maxInSuite))
    }

    if (landSuite) {
      moves.push(this.customMove(CustomMoveType.BankSequence, landSuite.maxInSuite))
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

  onCustomMove(_move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.BankSequence)(_move)) {
      return [this.startRule(RuleId.BankSequence)]
    }
    return []
  }
}
