import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { FaceColor } from '../../material/Face'

export class FaceCardHelper extends MaterialRulesPart {
  constructor(game: MaterialGame) {
    super(game)
  }

  getCardColor(cardId: { front: number; back: number }, rotated: boolean) {
    const currentId = this.getCurrentId(cardId, rotated)
    return Math.floor(currentId / 10) as FaceColor
  }

  getCardValue(cardId: { front: number; back: number }, rotated: boolean) {
    const currentId = this.getCurrentId(cardId, rotated)
    return currentId % 10
  }

  getCurrentId(cardId: { front: number; back: number }, rotated: boolean) {
    console.log(cardId, rotated)
    return rotated ? cardId.back : cardId.front
  }
}
