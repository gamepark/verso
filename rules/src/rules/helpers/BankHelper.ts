import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { CardId, FaceColor, getItemFaceColor } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class BankHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly player: number
  ) {
    super(game)
  }

  getBankScore(): number {
    return sumBy(this.bankCards.getItems(), (card) => (card.location.rotation ? 3 : 1))
  }

  getColorInBank(): FaceColor {
    return getItemFaceColor(this.bankCards.getItem<CardId>()!)
  }

  get bankCards() {
    return this.material(MaterialType.Card).location(LocationType.BankSequenceLayout)
  }
}
