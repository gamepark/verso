import { css } from '@emotion/react'
import { DropAreaDescription, getRelativePlayerIndex, LocationContext, Locator, MaterialContext } from '@gamepark/react-game'
import { isMoveItemType, Location, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { isEqual } from 'lodash'
import { faceCardDescription } from '../material/FaceCardDescription'

class PlayerLayoutLocator extends Locator {
  getLocations({ rules, player }: MaterialContext) {
    if (player) {
      const res = rules
        .getLegalMoves(player)
        .filter(isMoveItemType(MaterialType.Card))
        .filter((move) => move.location.type === LocationType.PlayerLayout)
        .map((move) => move.location) as Location[]
      console.log('res', res)
      return res
    }
    return []
  }
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

  locationDescription = new PlayerLayoutSpotDescription()
}

export class PlayerLayoutSpotDescription extends DropAreaDescription {
  constructor() {
    super(faceCardDescription)
  }

  getExtraCss(location: Location, { rules }: LocationContext) {
    console.log('location', location, rules)
    return css`
      background: red;
    `
  }

  canShortClick(move: MaterialMove, location: Location, _: MaterialContext) {
    return isMoveItemType(MaterialType.Card)(move) && isEqual(move.location.type, location.type)
  }
}

export const playerLayoutLocator = new PlayerLayoutLocator()
