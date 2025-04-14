import { DropAreaDescription, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class BankSequenceLayoutLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const base = this.getBaseCoordinates(location, context)
    if (location.x === undefined) return { x: base.x, y: base.y }

    const xLocation = location.x ?? 0
    return { x: base.x + xLocation * 7 - 21, y: base.y }
  }

  getBaseCoordinates(_: Location, context: MaterialContext) {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
        return { x: 6.5, y: -8 }
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
