import { FaceColor } from '../../material/Face'

export class FaceCardHelper {
  static getCardColor(cardId: { front: number; back: number }, rotated: boolean) {
    const currentId = this.getCurrentId(cardId, rotated)
    return Math.floor(currentId / 10) as FaceColor
  }

  static getCardValue(cardId: { front: number; back: number }, rotated: boolean) {
    const currentId = this.getCurrentId(cardId, rotated)
    return currentId % 10
  }

  static getCurrentId(cardId: { front: number; back: number }, rotated: boolean) {
    return rotated ? cardId.back : cardId.front
  }
}
