import { MaterialContext, PileLocator } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { faceCardDeckLocator } from './FaceCardDeckLocator'

export class DiscardLocator extends PileLocator {
  maxAngle = 10
  getCoordinates(_: Location, context: MaterialContext): Partial<Coordinates> {
    const nbPlayers = context.rules.players.length
    let deckCoordinates = faceCardDeckLocator.getCoordinates(_, context)
    deckCoordinates = { x: deckCoordinates.x! + 2, y: deckCoordinates.y! - 2 }

    if (nbPlayers === 6) {
      return { x: deckCoordinates.x!, y: deckCoordinates.y! + 8 }
    }
    return { x: deckCoordinates.x! + 7, y: deckCoordinates.y }
  }
}

export const discardLocator = new DiscardLocator()
