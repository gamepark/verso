import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { faceCardDeckLocator } from './FaceCardDeckLocator'

class VictoryPointTokenStockLocator extends PileLocator {
  radius = 4
  getCoordinates(_: Location, context: MaterialContext) {
    const deckCoordinates = faceCardDeckLocator.getCoordinates(_, context)

    return { x: deckCoordinates.x! - 10, y: deckCoordinates.y }
  }

  getPileId(item: MaterialItem) {
    return item.id
  }
}

export const victoryPointTokenStockLocator = new VictoryPointTokenStockLocator()
