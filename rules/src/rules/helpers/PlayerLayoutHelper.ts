import { Location, MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { FaceColor, isJoker } from '../../material/Face'
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

  getPlace(playerId: number, cardColor: FaceColor, cardValue: number) {
    let availablePlace: Location | undefined
    switch (cardColor) {
      case FaceColor.Sky:
        availablePlace = this.getPlaceByColor(playerId, cardValue, FaceColor.Sky, -8)
        break
      case FaceColor.Land:
        availablePlace = this.getPlaceByColor(playerId, cardValue, FaceColor.Land, 0)
        break
      case FaceColor.Sea:
        availablePlace = this.getPlaceByColor(playerId, cardValue, FaceColor.Sea, 8)
        break
    }
    return availablePlace
  }

  private getPlaceByColor(playerId: number, cardValue: number, color: FaceColor, y: number) {
    let availablePlace: Location | undefined
    const playerCards = this.getCards(playerId)
      .getItems()
      .filter(({ id, location }) => FaceCardHelper.getCardColor(id, location.rotation) === color)
      .sort((a, b) => FaceCardHelper.getCardValue(a.id, a.location.rotation) - FaceCardHelper.getCardValue(b.id, b.location.rotation))
    if (playerCards.length === 0) {
      availablePlace = { id: color, type: LocationType.PlayerLayout, player: this.player, x: 0, y }
    } else {
      const hightestCard = playerCards[playerCards.length - 1]
      if(cardValue > FaceCardHelper.getCardValue(hightestCard.id, hightestCard.location.rotation)) {
        availablePlace = { id: color, type: LocationType.PlayerLayout, player: this.player, x: hightestCard.location.x! + 1, y }
      } else {
        for(let i = 0; i < playerCards.length; i++) {
          const card = playerCards[i]
          const value = FaceCardHelper.getCardValue(card.id, card.location.rotation)
          const baseX = card.location.x ?? 0
          if (cardValue < value) {
            availablePlace = { id: color, type: LocationType.PlayerLayout, player: this.player, x: baseX, y }
            break
          }
        }
      }
    }
    return availablePlace
  }

  checkIfPlayerAlreadyHaveCard(card?: MaterialItem) {
    if (!card) return false

    return this.getCards(this.player)
      .getItems()
      .some((item) => {
        const itemCurrentId = FaceCardHelper.getCurrentId(item.id, item.location.rotation)
        const cardCurrentId = FaceCardHelper.getCurrentId(card.id, card.location.rotation)
        return itemCurrentId === cardCurrentId
      })
  }

  checkSuite(color: FaceColor) {
    const cards = this.getCards(this.player)
      .filter((card) => {
        const cardColor = FaceCardHelper.getCardColor(card.id, card.location.rotation)
        return cardColor === color
      })
      .getItems()
      .map((item) => {
        return FaceCardHelper.getCurrentId(item.id, item.location.rotation)
      })
      .sort()
    let maxInSuite: number | null = null
    let suites: Set<number> = new Set()
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
      .filter((card) => {
        const currentId = FaceCardHelper.getCurrentId(card.id, card.location.rotation)
        return currentId === cardId
      })
      .getIndex()
  }

  private getCards(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }
}
