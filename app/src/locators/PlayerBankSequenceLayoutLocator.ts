import { DropAreaDescription, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { playerLayoutLocator } from './PlayerLayoutLocator'

class PlayerBankSequenceLayoutLocator extends ListLocator {
  gap = { x: 7 }
  maxCount = 4
  getCoordinates(location: Location, context: MaterialContext) {
    const playerLayoutCoordinates = playerLayoutLocator.getBaseCoordinates(location, context)
    return { x: playerLayoutCoordinates.x + 7.2, y: playerLayoutCoordinates.y - 17 }
  }

  getDropLocations() {
    return [{ type: LocationType.PlayerBankSequenceLayout }]
  }

  locationDescription = new bankSequenceLayoutDescription()
}

export class bankSequenceLayoutDescription extends DropAreaDescription {
  width = 21
  height = 8
}

export const playerBankSequenceLayoutLocator = new PlayerBankSequenceLayoutLocator()
