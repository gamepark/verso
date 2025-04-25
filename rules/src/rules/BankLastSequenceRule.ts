import { CustomMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { CustomMoveType } from './CustomMoveType'
import { BankSequenceHelper } from './helpers/BankSequenceHelper'

export class BankLastSequenceRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: number) {
    const pass = this.customMove(CustomMoveType.Pass, { player })
    const helper = new BankSequenceHelper(this.game, player)
    return [pass, ...helper.getSequenceMoves()]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    return [this.endPlayerTurn(move.data.player)]
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return [this.endGame()]
  }
}
