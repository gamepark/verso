import { CustomMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CustomMoveType } from './CustomMoveType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class BankLastSequenceRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = super.getPlayerMoves()

    if (new PlayerLayoutHelper(this.game).canMakeSequence()) {
      moves.push(this.customMove(CustomMoveType.BankSequence))
    }

    moves.push(this.customMove(CustomMoveType.Pass))
    return moves
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    const moves: MaterialMove[] = []
    if (move.type === CustomMoveType.Pass) {
      if (this.remind(Memory.PlayerEndedGame) === this.player) {
        moves.push(this.endGame())
      } else {
        moves.push(this.startPlayerTurn(RuleId.BankLastSequence, this.nextPlayer))
      }
    }
    if (move.type === CustomMoveType.BankSequence) {
      moves.push(this.startRule(RuleId.BankSequence))
    }
    return moves
  }
}
