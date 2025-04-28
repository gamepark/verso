import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { playerLayoutLocator } from './PlayerLayoutLocator'

class PlayerVictoryPointTokenStockLocator extends PileLocator {
  radius = 3
  getCoordinates(location: Location, context: MaterialContext) {
    const playerLayoutCoordinates = playerLayoutLocator.getBaseCoordinates(location, context)
    return { x: playerLayoutCoordinates.x - 0.2, y: playerLayoutCoordinates.y - 17 }
  }

  getPileId(item: MaterialItem) {
    return `${item.location.player}-${item.id}`
  }
}

export const playerVictoryPointTokenStockLocator = new PlayerVictoryPointTokenStockLocator()
