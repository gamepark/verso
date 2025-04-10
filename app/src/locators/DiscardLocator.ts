import { DeckLocator } from '@gamepark/react-game'

export class DiscardLocator extends DeckLocator {
  coordinates = { x: 6.5, y: 0 }
  gap = { x: -0.01, y: -0.01 }
  limit = 90
}

export const discardLocator = new DiscardLocator()
