import { LocationDescription, Locator } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/verso/material/MaterialType'

export class FaceCardPointsLocator extends Locator {
  parentItemType = MaterialType.Card
  positionOnParent = { x: 50, y: 16 }
  locationDescription = new LocationDescription({ width: 5, height: 1, borderRadius: 0.1 })
}

export const faceCardPointsLocator = new FaceCardPointsLocator()
