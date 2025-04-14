import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class FaceCardDeckLocator extends DeckLocator {
  getCoordinates(_: Location, context: MaterialContext): Partial<Coordinates> {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
      case 2:
        return { y: -18 }
      default:
        return { x: 0, y: 0 }
    }
  }
}

export const faceCardDeckLocator = new FaceCardDeckLocator()
