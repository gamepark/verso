import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class FaceCardDeckLocator extends DeckLocator {
  getCoordinates(_: Location, context: MaterialContext): Partial<Coordinates> {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
        return { y: -18 }
      case 2:
        return { x: -22, y: -6 }
      case 3:
      case 5:
        return { x: 0 }
      case 4:
        return { y: -8 }
      default:
        return { y: -5 }
    }
  }
}

export const faceCardDeckLocator = new FaceCardDeckLocator()
