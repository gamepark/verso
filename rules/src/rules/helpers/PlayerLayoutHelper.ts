import { Material, MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { CardId, CardItem, getItemFaceColor, getItemFaceValue, JOKER } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class PlayerLayoutHelper extends MaterialRulesPart {
  playerCards: Material

  constructor(
    game: MaterialGame,
    readonly player: number
  ) {
    super(game)
    this.playerCards = this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }

  canCardMakeSequence(card: MaterialItem, cardIndex: number) {
    const color = getItemFaceColor(card as CardItem)
    const playerOtherCards = this.playerCards.index((index) => index !== cardIndex)
    const otherValues = playerOtherCards
      .filter((card) => getItemFaceColor(card as CardItem) === color)
      .getItems<CardId>()
      .map(getItemFaceValue)
    if (!otherValues.length) return false
    const value = getItemFaceValue(card as CardItem)
    if (value === JOKER) return true
    return otherValues.some((otherValue) => otherValue === JOKER || otherValue === value - 1 || otherValue === value + 1)
  }

  canMakeSequence() {
    return this.playerCards.entries.some(([index, card]) => this.canCardMakeSequence(card, index))
  }
}
