import { MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { CardId, CardItem, FaceColor, getItemFace, getItemFaceColor, isValidSequence } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { ScoreType } from './ScoreType'

export class BankLastSequenceRule extends SimultaneousRule {
  player: number | undefined = undefined
  getActivePlayerLegalMoves(player: number) {
    this.player = player
    const moves: MaterialMove[] = []

    moves.push(this.customMove(CustomMoveType.Pass))
    moves.push(
      ...this.cardsICanBank.moveItems((item) => ({
        type: LocationType.PlayerBankSequenceLayout,
        rotation: item.location.rotation,
        player: player
      }))
    )

    if (this.sequenceCards.length > 1) {
      moves.push(
        this.customMove(CustomMoveType.Score, {
          type: ScoreType.Sequence,
          color: this.sequenceColor,
          score: this.sequenceScore,
          player: player
        })
      )
    }

    return moves
  }

  get cardsICanBank() {
    const helper = new PlayerLayoutHelper(this.game, this.player)
    const sequence = this.sequenceCards.getItems<CardId>().map(getItemFace)
    if (!sequence.length) {
      return helper.playerCards.filter((card, index) => helper.canCardMakeSequence(card, index))
    } else {
      return helper.playerCards.filter((item) => isValidSequence([...sequence, getItemFace(item as CardItem)]))
    }
  }

  get sequenceCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerBankSequenceLayout).player(this.player)
  }

  get sequenceScore(): number {
    return sumBy(this.sequenceCards.getItems(), (card) => (card.location.rotation ? 3 : 1))
  }

  get sequenceColor(): FaceColor {
    return getItemFaceColor(this.sequenceCards.getItem<CardId>()!)
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    return [this.endGame()]
  }
}
