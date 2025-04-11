import { Location, MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { uniqBy } from 'lodash'
import { FaceColor } from '../../material/Face'
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

  getFreePlaces(playerId: number, cardColor: FaceColor, cardValue: number) {
    const availablePlaces: Location[] = []
    switch (cardColor) {
      case FaceColor.Sky:
        availablePlaces.push(...this.getFreePlacesByColor(playerId, cardValue, FaceColor.Sky, -8))
        break
      case FaceColor.Land:
        availablePlaces.push(...this.getFreePlacesByColor(playerId, cardValue, FaceColor.Land, 0))
        break
      case FaceColor.Sea:
        availablePlaces.push(...this.getFreePlacesByColor(playerId, cardValue, FaceColor.Sea, 8))
        break
    }
    return availablePlaces
  }

  private getFreePlacesByColor(playerId: number, cardValue: number, color: FaceColor, y: number) {
    const availablePlaces: Location[] = []
    const faceCardHelper = new FaceCardHelper(this.game)
    const playerCards = this.getCards(playerId)
      .getItems()
      .filter(({ id, location }) => faceCardHelper.getCardColor(id, location.rotation) === color)

    if (playerCards.length === 0) {
      availablePlaces.push({ id: color, type: LocationType.PlayerLayout, player: this.player, x: 0, y })
    } else {
      playerCards.forEach((card) => {
        const value = faceCardHelper.getCardValue(card.id, card.location.rotation)
        const baseX = card.location.x ?? 0
        if (cardValue < value) {
          availablePlaces.push({ id: color, type: LocationType.PlayerLayout, player: this.player, x: baseX, y })
        }
        if (cardValue > value) {
          availablePlaces.push({ id: color, type: LocationType.PlayerLayout, player: this.player, x: baseX + 1, y })
        }
      })
    }
    return uniqBy(availablePlaces, (location) => JSON.stringify(location))
  }

  checkIfPlayerAlreadyHaveCard(card?: MaterialItem) {
    if (!card) return false

    return this.getCards(this.player)
      .getItems()
      .some((item) => {
        const faceCardHelper = new FaceCardHelper(this.game)
        const itemCurrentId = faceCardHelper.getCurrentId(item.id, item.location.rotation)
        const cardCurrentId = faceCardHelper.getCurrentId(card.id, card.location.rotation)
        return itemCurrentId === cardCurrentId
      })
  }

  checkSuite(color: FaceColor) {
    const cards = this.getCards(this.player)
      .filter((card) => {
        const faceCardHelper = new FaceCardHelper(this.game)
        const cardColor = faceCardHelper.getCardColor(card.id, card.location.rotation)
        return cardColor === color
      })
      .getItems()
      .map((item) => {
        const faceCardHelper = new FaceCardHelper(this.game)
        return faceCardHelper.getCurrentId(item.id, item.location.rotation)
      })
      .sort()
    let maxInSuite: number | null = null

    for (let i = 0; i < cards.length - 1; i++) {
      if (cards[i + 1] - cards[i] === 1) {
        maxInSuite = cards[i + 1]
      }
    }

    if (maxInSuite) {
      return this.getCards(this.player)
        .filter((card) => {
          const faceCardHelper = new FaceCardHelper(this.game)
          const currentId = faceCardHelper.getCurrentId(card.id, card.location.rotation)
          return currentId === maxInSuite
        })
        .getIndex()
    }
    return null
  }

  private getCards(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }
}
