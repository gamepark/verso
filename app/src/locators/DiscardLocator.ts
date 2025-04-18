import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class DiscardLocator extends PileLocator {
  maxAngle = 10
  getCoordinates(_: Location, context: MaterialContext): Partial<Coordinates> {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
        return { x: 6.5, y: -18 }
      case 2:
        return { x: -15.5, y: -6 }
      case 3:
      case 5:
        return { x: 6.5 }
      case 4:
        return { x: 6.5, y: -8 }
      default:
        return { x: 6.5, y: -5 }
    }
  }
}

export const discardLocator = new DiscardLocator()
