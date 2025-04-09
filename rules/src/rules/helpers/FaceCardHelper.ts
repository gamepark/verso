import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { FaceColor } from '../../material/Face'

export class FaceCardHelper extends MaterialRulesPart {
  constructor(game: MaterialGame) {
    super(game)
  }

  getCardColor(cardId: { front: number; back: number }, rotated: boolean) {
    const currentId = rotated ? cardId.back : cardId.front
    console.log('cardId', currentId)
    return Math.floor(currentId / 10) as FaceColor
  }

  getCardValue(cardId: number) {
    return cardId % 10
  }
}
