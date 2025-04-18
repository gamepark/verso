import { getRelativePlayerIndex, MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'

class PlayerVictoryPointTokenStockLocator extends PileLocator {
  radius = 3
  getCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
        if (context.rules.players.length === 1) return { x: -24.5, y: 2 }
        if (context.rules.players.length === 2) return { x: -40, y: 3 }
        if (context.rules.players.length === 3) return { x: -50, y: 3 }
        if (context.rules.players.length === 4) return { x: -50, y: 3 }
        if (context.rules.players.length === 5) return { x: -18, y: 28 }
        return { x: -22, y: 33 }
      case 1:
        if (context.rules.players.length === 2) return { x: 40, y: 3 }
        if (context.rules.players.length === 3) return { x: -22, y: -30 }
        if (context.rules.players.length === 4) return { x: -14, y: -30 }
        if (context.rules.players.length === 5) return { x: -55, y: -26 }
        return { x: -55, y: 31 }
      case 2:
        if (context.rules.players.length === 3) return { x: 50, y: 3 }
        if (context.rules.players.length === 4) return { x: 14, y: -30 }
        if (context.rules.players.length === 5) return { x: -22, y: -30 }
        return { x: -55, y: -31 }
      case 3:
        if (context.rules.players.length === 4) return { x: 50, y: 3 }
        if (context.rules.players.length === 5) return { x: 50, y: -26 }
        return { x: -22, y: -33 }
      case 4:
        if (context.rules.players.length === 5) return { x: 17, y: 28 }
        return { x: 50, y: -31 }
      case 5:
      default:
        return { x: 50, y: 31 }
    }
  }

  getPileId(item: MaterialItem) {
    return `${item.location.player}-${item.id}`
  }
}


export const playerVictoryPointTokenStockLocator = new PlayerVictoryPointTokenStockLocator()
