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
    const index = this.game.players.findIndex((p) => p === this.player)
    if (index === 0) {
      return uniq([this.game.players[this.game.players.length - 1], this.game.players[1]])
    }
    if (index === this.game.players.length - 1) {
      return uniq([this.game.players[this.game.players.length - 2], this.game.players[0]])
    }
    return uniq([this.game.players[index - 1], this.game.players[index + 1]])
  }
}
