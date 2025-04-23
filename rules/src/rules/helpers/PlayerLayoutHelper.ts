import { getEnumValues, Material, MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { CardItem, FaceColor, isJoker } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { FaceCardHelper } from './FaceCardHelper'

export class PlayerLayoutHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly player: number
  ) {
    super(game)
  }

  playerHasFace(card: Material) {
    if (!card.length) return false
    const face = FaceCardHelper.getCurrentId(card.getItem()!)
    const cardIndex = card.getIndex()
    return this.getCards(this.player).filter((item, index) => index !== cardIndex && FaceCardHelper.getCurrentId(item as CardItem) === face).length > 0
  }

  checkIfPlayerAlreadyHaveCard(card?: MaterialItem) {
    if (!card) return false

    return this.getCards(this.player)
      .getItems()
      .some((item) => {
        const itemCurrentId = FaceCardHelper.getCurrentId(item as CardItem)
        const cardCurrentId = FaceCardHelper.getCurrentId(card as CardItem)
        return itemCurrentId === cardCurrentId
      })
  }

  checkSuite(color: FaceColor) {
    const cards = this.getCards(this.player)
      .filter((card) => {
        const cardColor = FaceCardHelper.getCardColor(card as CardItem)
        return cardColor === color
      })
      .getItems()
      .map((item) => {
        return FaceCardHelper.getCurrentId(item as CardItem)
      })
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
      .filter((card) => {
        const currentId = FaceCardHelper.getCurrentId(card as CardItem)
        return currentId === cardId
      })
      .getIndex()
  }

  private getCards(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }
}
