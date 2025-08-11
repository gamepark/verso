import { CustomMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardId, FaceColor, getItemFaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { BankSequenceHelper } from './helpers/BankSequenceHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class BankSequenceRule extends PlayerTurnRule {
  getPlayerMoves() {
    return new BankSequenceHelper(this.game).getSequenceMoves()
  }

  get sequenceCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerBankSequenceLayout).player(this.player)
  }

  get sequenceColor(): FaceColor {
    return getItemFaceColor(this.sequenceCards.getItem<CardId>()!)
  }

  onCustomMove(move: CustomMove) {
    const moves: MaterialMove[] = []
    if (move.type === CustomMoveType.Score) {
      const sequenceColor = this.sequenceColor
      this.memorize(Memory.BankedSequence, sequenceColor)

      const sequenceCards = this.sequenceCards

      const cardsToDiscard = sequenceCards.sort((item) => -item.location.x!).limit(2)
      moves.push(...cardsToDiscard.moveItems((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))

      const cardsToTakeBack = sequenceCards.sort((item) => item.location.x!).limit(sequenceCards.length - 2)
      moves.push(
        ...cardsToTakeBack.moveItems((item) => ({
          type: LocationType.PlayerLayout,
          player: this.player,
          id: sequenceColor,
          rotation: item.location.rotation
        }))
      )

      if (this.game.players.length === 1) {
        moves.push(this.startRule(RuleId.SimulateOtherPlayer))
      } else {
        moves.push(this.startRule(RuleId.FlipCardAfterBankSequence))
      }
    }
    return moves
  }
}
