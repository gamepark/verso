import { PileLocator } from '@gamepark/react-game'

export class DiscardLocator extends PileLocator {
  coordinates = { x: 6.5 }
  maxAngle = 10
}

export const discardLocator = new DiscardLocator()
