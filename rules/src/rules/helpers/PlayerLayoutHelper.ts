import { Material, MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { CardId, CardItem, FaceColor, getItemFace, getItemFaceColor, getItemFaceValue, isJoker, JOKER } from '../../material/Face'
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

  checkSuite(color: FaceColor) {
    const cards = this.getCards(this.player)
      .filter((card) => getItemFaceColor(card as CardItem) === color)
      .getItems<CardId>()
      .map(getItemFace)
      .sort()
    let maxInSuite: number | null = null
    const suites = new Set<number>()
    for (let i = 0; i < cards.length; i++) {
      if (cards[i + 1] - cards[i] === 1) {
        maxInSuite = cards[i + 1]
        suites.add(cards[i])
        suites.add(cards[i + 1])
      } else {
        const jockerIndex = cards.findIndex((card) => isJoker(card))
        if (jockerIndex !== -1) {
          maxInSuite = cards[i]
          suites.add(cards[jockerIndex])
          suites.add(cards[i])
        }
      }
    }

    if (maxInSuite && suites.size > 1) {
      return {
        maxInSuite: this.getCardIndexFromId(maxInSuite),
        suites: Array.from(suites).map((id) => this.getCardIndexFromId(id))
      }
    }
    return null
  }

  private getCardIndexFromId(cardId: number) {
    return this.getCards(this.player)
      .filter((card) => getItemFace(card as CardItem) === cardId)
      .getIndex()
  }

  private getCards(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }
}
