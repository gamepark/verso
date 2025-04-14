import { DropAreaDescription, getRelativePlayerIndex, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class PlayerLayoutLocator extends ListLocator {
  gap = { x: 7 }
  maxCount = 5
  getCoordinates(location: Location, context: MaterialContext) {
    const base = this.getBaseCoordinates(location, context)
    const xBase = base.x
    const yBase = base.y ?? 0
    if (location.x === undefined) return { x: xBase, y: yBase }

    const yLocation = location.id === 1 ? 8 : location.id === 2 ? 0 : -8
    return { x: xBase, y: yBase + yLocation }
  }
  getBaseCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
        if (context.rules.players.length === 1) return { x: -14.5, y: 12 }
        if (context.rules.players.length === 2) return { x: -45, y: 12 }
        if (context.rules.players.length === 3) return { x: -50, y: 20 }
        if (context.rules.players.length === 4) return { x: -50, y: 20 }
        if (context.rules.players.length === 5) return { x: -55, y: 20 }
        return { x: -21, y: 25 }
      case 1:
        if (context.rules.players.length === 2) return { x: 16, y: 12 }
        if (context.rules.players.length === 3) return { x: -14, y: -20 }
        if (context.rules.players.length === 4) return { x: -50, y: -20 }
        if (context.rules.players.length === 5) return { x: -55, y: -10 }
        return { x: -75, y: 14 }
      case 2:
        if (context.rules.players.length === 3) return { x: 22, y: 20 }
        if (context.rules.players.length === 4) return { x: 22, y: -20 }
        if (context.rules.players.length === 5) return { x: -14, y: -20 }
        return { x: -75, y: -15 }
      case 3:
        if (context.rules.players.length === 4) return { x: 22, y: 20 }
        if (context.rules.players.length === 5) return { x: 25, y: -10 }
        return { x: -21, y: -25 }
      case 4:
        if (context.rules.players.length === 5) return { x: 25, y: 20 }
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
  width = 42
  height = 24
}

export const playerLayoutLocator = new PlayerLayoutLocator()
