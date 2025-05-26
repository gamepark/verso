import { css } from '@emotion/react'
import { DeckLocator, LocationDescription, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { faceCardDescription } from '../material/FaceCardDescription'
import { StackSpotCounter } from './component/StackSpotCounter'

export class FaceCardDeckLocator extends DeckLocator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const coordinates = this.getBaseCoordinates(context)
    if (location.x !== undefined) return coordinates
    return { x: coordinates.x! - 2, y: coordinates.y! + 2 }
  }
  getBaseCoordinates(context: MaterialContext): Partial<Coordinates> {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
        return { x: 0, y: -18 }
      case 2:
        return { x: 0, y: -6 }
      case 3:
        return { x: 0, y: -10 }
      case 4:
        return { x: 0, y: 0 }
      case 5:
        return { x: 0, y: 20 }
      default:
        return { x: -77, y: 0 }
    }
  }

  location = {}

  navigationSorts = []

  locationDescription = new FaceCardDeckDescription(faceCardDescription)
}

class FaceCardDeckDescription extends LocationDescription {
  content = StackSpotCounter

  extraCss = css`
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;

    > span {
      font-size: 1.75em;
      font-weight: bolder;
      color: white;
      opacity: 0.7;
      text-shadow:
        3px 3px 0 #000,
        -3px 3px 0 #000,
        -3px -3px 0 #000,
        3px -3px 0 #000;
      margin-right: 0.2em;
    }
  `
}

export const faceCardDeckLocator = new FaceCardDeckLocator()
