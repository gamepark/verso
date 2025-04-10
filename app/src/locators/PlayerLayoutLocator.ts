import { DropAreaDescription, getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
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
      return res
    }
    return []
  }
  getCoordinates(location: Location, context: MaterialContext) {
    const base = this.getBaseCoordinates(location, context)
    const xLocation = location.x ?? 0
    const yLocation = location.y ?? 0
    const xBase = base.x ?? 0
    const yBase = base.y ?? 0
    return { ...base, x: xBase + xLocation, y: yBase + yLocation }
  }
  getBaseCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
        if (context.rules.players.length === 2) return { x: -45, y: 6 }
        if (context.rules.players.length === 3) return { x: -45, y: 6 }
        if (context.rules.players.length === 4) return { x: -45, y: 13 }
        if (context.rules.players.length === 5) return { x: -45, y: 13 }
        return { x: -45, y: 6 }
      case 1:
        if (context.rules.players.length === 2) return { x: 15, y: 6 }
        if (context.rules.players.length === 3) return { y: -17 }
        if (context.rules.players.length === 4) return { x: -45, y: -13 }
        if (context.rules.players.length === 5) return { x: -45, y: -13 }
        return { x: -45, y: -6 }
      case 2:
        if (context.rules.players.length === 3) return { x: 15, y: 6 }
        if (context.rules.players.length === 4) return { x: 15, y: -13 }
        if (context.rules.players.length === 5) return { y: -17 }
        return { y: -17 }
      case 3:
        if (context.rules.players.length === 4) return { x: 15, y: 13 }
        if (context.rules.players.length === 5) return { x: 15, y: -13 }
        return { x: 15, y: -6 }
      case 4:
        if (context.rules.players.length === 5) return { x: 15, y: 13 }
        return { x: 15, y: 6 }
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

  canShortClick(move: MaterialMove, location: Location, _: MaterialContext) {
    return isMoveItemType(MaterialType.Card)(move) && isEqual(move.location.type, location.type)
  }
}

export const playerLayoutLocator = new PlayerLayoutLocator()
