import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { faceCardDeckLocator } from './FaceCardDeckLocator'

class VictoryPointTokenStockLocator extends PileLocator {
  radius = 4
  getCoordinates(_: Location, context: MaterialContext) {
    const nbPlayers = context.rules.players.length
    let deckCoordinates = faceCardDeckLocator.getCoordinates(_, context)
    deckCoordinates = { x: deckCoordinates.x! + 2, y: deckCoordinates.y! - 2 }

    if (nbPlayers === 6) {
      return { x: deckCoordinates.x!, y: deckCoordinates.y! - 10 }
    }
    return { x: deckCoordinates.x! - 10, y: deckCoordinates.y }
  }

  getPileId(item: MaterialItem) {
    return item.id
  }
}

export const victoryPointTokenStockLocator = new VictoryPointTokenStockLocator()
