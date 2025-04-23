import { getEnumValues, Material, MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { CardId, CardItem, FaceColor, getItemFace, getItemFaceColor, isJoker } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class PlayerLayoutHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly player: number
  ) {
    super(game)
  }

  playerHasFace(card: Material) {
    if (!card.length) return false
    const face = getItemFace(card.getItem<CardId>()!)
    const cardIndex = card.getIndex()
    return this.getCards(this.player).entries.some(([index, item]) => index !== cardIndex && getItemFace(item as CardItem) === face)
  }

  checkIfPlayerAlreadyHaveCard(card?: CardItem) {
    if (!card) return false
    const cardFace = getItemFace(card)
    return this.getCards(this.player)
      .getItems<CardId>()
      .some((item) => getItemFace(item) === cardFace)
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

  atLeastOneColorAsSequence() {
    return getEnumValues(FaceColor).some((color) => this.checkSuite(color) !== null)
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
