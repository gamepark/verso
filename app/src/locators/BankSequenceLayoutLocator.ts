import { DropAreaDescription, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'

class BankSequenceLayoutLocator extends ListLocator {
  gap = { x: 7 }
  maxCount = 3
  getCoordinates(_: Location, context: MaterialContext) {
    const nbPlayers = context.rules.players.length
    switch (nbPlayers) {
      case 1:
      case 2:
        return { x: -5, y: -8 }
      case 3:
      case 5:
        return { x: -5, y: 10 }
      case 4:
        return { x: -5, y: 2 }
      default:
        return { x: -5, y: 5 }
    }
  }

  getDropLocations() {
    return [{ type: LocationType.BankSequenceLayout }]
  }

  locationDescription = new bankSequenceLayoutDescription()
}

export class bankSequenceLayoutDescription extends DropAreaDescription {
  width = 21
  height = 8
}

export const bankSequenceLayoutLocator = new BankSequenceLayoutLocator()
