import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { CardId, CardItem, FaceColor, getItemFace, getItemFaceColor, isValidSequence } from '../../material/Face'
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

  getPossibleMovesInBank() {
    const sequence = this.bankCards.getItems<CardId>().map(getItemFace)
    return this.playerCards
      .filter((item) => isValidSequence([...sequence, getItemFace(item as CardItem)]))
      .moveItems((item) => ({
        type: LocationType.BankSequenceLayout,
        rotation: item.location.rotation
      }))
  }

  getColorInBank(): FaceColor {
    const bankCards = this.bankCards.getItems()
    return getItemFaceColor(bankCards[0] as CardItem)
  }

  get playerCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }

  get bankCards() {
    return this.material(MaterialType.Card).location(LocationType.BankSequenceLayout)
  }
}
