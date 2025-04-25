import { CustomMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { BankSequenceHelper } from './helpers/BankSequenceHelper'
import { Scoring } from './ScoreType'

export class BankLastSequenceRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: number) {
    const pass = this.endPlayerTurn(player)
    const helper = new BankSequenceHelper(this.game, player)
    return [pass, ...helper.getSequenceMoves()]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    return [this.endPlayerTurn((move.data as Scoring).player)]
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return [this.endGame()]
  }
}
