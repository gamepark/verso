import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'

class VictoryPointTokenStockLocator extends PileLocator {
  radius = 4
  getCoordinates(_: Location, context: MaterialContext) {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
        return { x: -15, y: -18 }
      case 2:
        return { x: 20, y: -6 }
      case 3:
      case 5:
        return { x: -5, y: 10 }
      case 4:
        return { x: -5, y: 2 }
      default:
        return { x: -5, y: 5 }
    }
  }

  getPileId(item: MaterialItem) {
    return item.id
  }
}


export const victoryPointTokenStockLocator = new VictoryPointTokenStockLocator()
