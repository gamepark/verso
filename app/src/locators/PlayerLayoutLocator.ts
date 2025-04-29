import { DropAreaDescription, getRelativePlayerIndex, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class PlayerLayoutLocator extends ListLocator {
  gap = { x: 7 }
  maxCount = 5
  getCoordinates(location: Location, context: MaterialContext) {
    const base = this.getBaseCoordinates(location, context)
    const xBase = base.x
    const yBase = base.y
    if (location.x === undefined) return { x: xBase, y: yBase }

    const yLocation = location.id === 1 ? 8 : location.id === 2 ? 0 : -8
    return { x: xBase, y: yBase + yLocation }
  }
  getBaseCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
        if (context.rules.players.length === 1) return { x: -14.5, y: 12 }
        if (context.rules.players.length === 2) return { x: -33, y: 22 }
        if (context.rules.players.length === 3) return { x: -60, y: 22 }
        if (context.rules.players.length === 4) return { x: -50, y: 22 }
        if (context.rules.players.length === 5) return { x: -55, y: 22 }
        return { x: -14, y: 32 }
      case 1:
        if (context.rules.players.length === 2) return { x: 5, y: 22 }
        if (context.rules.players.length === 3) return { x: -14, y: 22 }
        if (context.rules.players.length === 4) return { x: -50, y: -13 }
        if (context.rules.players.length === 5) return { x: -55, y: -13 }
        return { x: -55, y: 22 }
      case 2:
        if (context.rules.players.length === 3) return { x: 32, y: 22 }
        if (context.rules.players.length === 4) return { x: 22, y: -13 }
        if (context.rules.players.length === 5) return { x: -14, y: -13 }
        return { x: -55, y: -15 }
      case 3:
        if (context.rules.players.length === 4) return { x: 22, y: 22 }
        if (context.rules.players.length === 5) return { x: 25, y: -13 }
        return { x: -14, y: -23 }
      case 4:
        if (context.rules.players.length === 5) return { x: 25, y: 22 }
        return { x: 25, y: -15 }
      case 5:
      default:
        return { x: 25, y: 22 }
    }
  }

  getDropLocations() {
    return [{ type: LocationType.PlayerLayout }]
  }

  locationDescription = new PlayerLayoutSpotDescription()
}

export class PlayerLayoutSpotDescription extends DropAreaDescription {
  width = 35
  height = 24
}

export const playerLayoutLocator = new PlayerLayoutLocator()
