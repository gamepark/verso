import { Material, MaterialGame, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { CardId, CardItem, getItemFace, getItemFaceColor, isValidSequence } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { ScoreType } from '../ScoreType'
import { PlayerLayoutHelper } from './PlayerLayoutHelper'

export class BankSequenceHelper extends MaterialRulesPart {
  player?: number
  playerSequence: Material

  constructor(game: MaterialGame, player = game.rule?.player) {
    super(game)
    this.player = player
    this.playerSequence = this.material(MaterialType.Card).location(LocationType.PlayerBankSequenceLayout).player(player)
  }

  getSequenceMoves() {
    const moves: MaterialMove[] = this.getCardsPlayerCanBank().moveItems((item) => ({
      type: LocationType.PlayerBankSequenceLayout,
      rotation: item.location.rotation,
      player: this.player
    }))
    if (this.playerSequence.length > 1) {
      const color = getItemFaceColor(this.playerSequence.getItem<CardId>()!)
      const score = sumBy(this.playerSequence.getItems(), (card) => (card.location.rotation ? 3 : 1))
      moves.push(this.customMove(CustomMoveType.Score, { type: ScoreType.Sequence, color, score, player: this.player }))
    }
    return moves
  }

  getCardsPlayerCanBank() {
    const helper = new PlayerLayoutHelper(this.game, this.player)
    const sequence = this.playerSequence.getItems<CardId>().map(getItemFace)
    if (!sequence.length) {
      return helper.playerCards.filter((card, index) => helper.canCardMakeSequence(card, index))
    } else {
      return helper.playerCards.filter((item) => isValidSequence([...sequence, getItemFace(item as CardItem)]))
    }
  }
}
