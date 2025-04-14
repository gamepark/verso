import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class DiscardLocator extends PileLocator {
  maxAngle = 10
  getCoordinates(_: Location, context: MaterialContext): Partial<Coordinates> {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
        return { x: 6.5, y: -18 }
      default:
        return { x: 0, y: 0 }
    }
  }
}

export const discardLocator = new DiscardLocator()
