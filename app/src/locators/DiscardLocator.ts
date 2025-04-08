import { DeckLocator } from '@gamepark/react-game'

export class DiscardLocator extends DeckLocator {
  coordinates = { x: 8, y: 0 }
  gap = { x: -0.03, y: -0.03 }
  limit = 90
}

export const discardLocator = new DiscardLocator()
