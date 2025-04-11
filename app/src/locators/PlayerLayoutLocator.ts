import { DropAreaDescription, getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class PlayerLayoutLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const base = this.getBaseCoordinates(location, context)
    const xBase = base.x ?? 0
    const yBase = base.y ?? 0
    if (location.x === undefined) return { x: xBase + 18, y: yBase }

    const xLocation = location.x ?? 0
    const yLocation = location.y ?? 0
    return { x: xBase + xLocation * 7, y: yBase + yLocation }
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

  getDropLocations() {
    return [{ type: LocationType.PlayerLayout }]
  }

  locationDescription = new PlayerLayoutSpotDescription()
}

export class PlayerLayoutSpotDescription extends DropAreaDescription {
  width = 42
  height = 24
}

export const playerLayoutLocator = new PlayerLayoutLocator()
