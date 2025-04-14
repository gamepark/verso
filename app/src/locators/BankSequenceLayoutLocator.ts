import { DropAreaDescription, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class BankSequenceLayoutLocator extends ListLocator {
  gap = { x: 7 }
  maxCount = 3
  getCoordinates(location: Location, context: MaterialContext) {
    const base = this.getBaseCoordinates(location, context)
    if (location.x === undefined) return { x: base.x, y: base.y }

    const xLocation = location.x ?? 0
    return { x: base.x + xLocation - 16, y: base.y }
  }

  getBaseCoordinates(_: Location, context: MaterialContext) {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
      case 2:
        return { x: 6.5, y: -8 }
      case 3:
        return { x: 6.5, y: 10 }
      default:
        return { x: 0, y: 0 }
    }
  }

  getDropLocations() {
    return [{ type: LocationType.BankSequenceLayout }]
  }

  locationDescription = new bankSequenceLayoutDescription()
}

export class bankSequenceLayoutDescription extends DropAreaDescription {
  width = 49
  height = 8
}

export const bankSequenceLayoutLocator = new BankSequenceLayoutLocator()
