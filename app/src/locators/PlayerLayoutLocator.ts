import { DropAreaDescription, getRelativePlayerIndex, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class PlayerLayoutLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const base = this.getBaseCoordinates(location, context)
    const xBase = base.x
    const yBase = base.y ?? 0
    if (location.x === undefined) return { x: xBase + 21, y: yBase }

    const xLocation = location.x ?? 0
    const yLocation = location.id === 1 ? 8 : location.id === 2 ? 0 : -8
    return { x: xBase + xLocation * 7, y: yBase + yLocation }
  }
  getBaseCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
        if (context.rules.players.length === 2) return { x: -70 }
        if (context.rules.players.length === 3) return { x: -70, y: 24 }
        if (context.rules.players.length === 4) return { x: -70, y: 24 }
        if (context.rules.players.length === 5) return { x: -75, y: 24 }
        return { x: -21, y: 25 }
      case 1:
        if (context.rules.players.length === 2) return { x: 28 }
        if (context.rules.players.length === 3) return { x: -20, y: -25 }
        if (context.rules.players.length === 4) return { x: -70, y: -25 }
        if (context.rules.players.length === 5) return { x: -75, y: -10 }
        return { x: -75, y: 14 }
      case 2:
        if (context.rules.players.length === 3) return { x: 28, y: 24 }
        if (context.rules.players.length === 4) return { x: 28, y: 24 }
        if (context.rules.players.length === 5) return { x: -21, y: -25 }
        return { x: -75, y: -15 }
      case 3:
        if (context.rules.players.length === 4) return { x: 28, y: -24 }
        if (context.rules.players.length === 5) return { x: 33, y: -10 }
        return { x: -21, y: -25 }
      case 4:
        if (context.rules.players.length === 5) return { x: 33, y: 24 }
        return { x: 33, y: -15 }
      case 5:
      default:
        return { x: 33, y: 14 }
    }
  }

  getDropLocations() {
    return [{ type: LocationType.PlayerLayout }]
  }

  locationDescription = new PlayerLayoutSpotDescription()
}

export class PlayerLayoutSpotDescription extends DropAreaDescription {
  width = 49
  height = 24
}

export const playerLayoutLocator = new PlayerLayoutLocator()
