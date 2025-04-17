import { MaterialMove } from '@gamepark/rules-api'
import { uniq } from 'lodash'
import { FaceColor } from '../material/Face'
import { FlipCardRule } from './FlipCardRule'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class FlipCardAfterBankSequenceRule extends FlipCardRule {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const color = this.remind<FaceColor>(Memory.BankedSequence)
    for (const player of this.getPlayersNear()) {
      const flip = this.flipPlayerCard(player, color)
      if (flip) moves.push(flip)
    }
    moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
    return moves
  }

  getPlayersNear() {
    if (this.player === 1) {
      return uniq([this.game.players.length, 2])
    }
    if (this.player === this.game.players.length) {
      return uniq([this.game.players.length - 1, 1])
    }
    return uniq([this.player - 1, this.player + 1])
  }
}
