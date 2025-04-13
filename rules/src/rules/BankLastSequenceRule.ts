import { CustomMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { FaceColor } from '../material/Face'
import { CustomMoveType } from './CustomMoveType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class BankLastSequenceRule extends PlayerTurnRule {
  getPlayerMoves() {
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

    moves.push(this.customMove(CustomMoveType.Pass))
    return moves
  }

  onCustomMove(_move: CustomMove): MaterialMove[] {
    const moves: MaterialMove[] = []
    if(_move.type === CustomMoveType.Pass) {
      if (this.remind(Memory.PlayerEndedGame) === this.player) {
        moves.push(this.endGame())
      } else {
        moves.push(this.startPlayerTurn(RuleId.BankLastSequence, this.nextPlayer))
      }
    }
    if(_move.type === CustomMoveType.BankSequence) {
      moves.push(this.startRule(RuleId.BankSequence))
    }
    return moves
  }
}
