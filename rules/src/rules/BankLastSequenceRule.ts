import { CustomMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { BankSequenceHelper } from './helpers/BankSequenceHelper'
import { Scoring } from './ScoreType'

export class BankLastSequenceRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: number) {
    return new BankSequenceHelper(this.game, player).getSequenceMoves()
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    return [this.endPlayerTurn((move.data as Scoring).player)]
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return [this.endGame()]
  }
}
