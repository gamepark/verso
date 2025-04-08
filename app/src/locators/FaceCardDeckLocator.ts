import { DeckLocator } from '@gamepark/react-game'

export class FaceCardDeckLocator extends DeckLocator {
  coordinates = { x: 0, y: 0 }
  gap = { x: -0.03, y: -0.03 }
  limit = 90
}

export const faceCardDeckLocator = new FaceCardDeckLocator()
