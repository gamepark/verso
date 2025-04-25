import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class FaceCardDeckLocator extends DeckLocator {
  getCoordinates(_: Location, context: MaterialContext): Partial<Coordinates> {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
        return { x: 0, y: -18 }
      case 2:
        return { x: 0, y: -6 }
      case 3:
      case 5:
        return { x: 0, y: 10 }
      case 4:
      default:
        return { x: 0, y: 0 }
    }
  }

  navigationSorts = []
}

export const faceCardDeckLocator = new FaceCardDeckLocator()
