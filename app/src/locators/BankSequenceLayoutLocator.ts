import { DropAreaDescription, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class BankSequenceLayoutLocator extends Locator {
  getCoordinates(location: Location, _: MaterialContext) {
    const xBase = 0
    const yBase = 8
    if (location.x === undefined) return { x: xBase, y: yBase }

    const xLocation = location.x ?? 0
    return { x: xBase + xLocation * 7 - 21, y: yBase }
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
