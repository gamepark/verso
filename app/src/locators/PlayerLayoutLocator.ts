import { getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class PlayerLayoutLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
        if (context.rules.players.length === 2) return { x: -30 }
        if (context.rules.players.length === 3) return { x: -30, y: 8 }
        if (context.rules.players.length === 4) return { x: -30, y: 13 }
        if (context.rules.players.length === 5) return { x: -35, y: 13 }
        return { x: -30, y: 8 }
      case 1:
        if (context.rules.players.length === 2) return { x: 30 }
        if (context.rules.players.length === 3) return { y: -17 }
        if (context.rules.players.length === 4) return { x: -30, y: -13 }
        if (context.rules.players.length === 5) return { x: -35, y: -13 }
        return { x: -30, y: -8 }
      case 2:
        if (context.rules.players.length === 3) return { x: 30, y: 8 }
        if (context.rules.players.length === 4) return { x: 30, y: -13 }
        if (context.rules.players.length === 5) return { y: -17 }
        return { y: -17 }
      case 3:
        if (context.rules.players.length === 4) return { x: 30, y: 13 }
        if (context.rules.players.length === 5) return { x: 35, y: -13 }
        return { x: 30, y: -8 }
      case 4:
        if (context.rules.players.length === 5) return { x: 35, y: 13 }
        return { x: 30, y: 8 }
      case 5:
      default:
        return { y: 17 }
    }
  }
}

export const playerLayoutLocator = new PlayerLayoutLocator()
