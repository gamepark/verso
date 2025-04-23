import { Location, MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { sumBy } from 'lodash'
import { CardItem, FaceColor } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { FaceCardHelper } from './FaceCardHelper'

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
    const bankCards: CardItem[] = this.bankCards.getItems()
    const valuesInBank = bankCards.map((bankCard) => FaceCardHelper.getCardValue(bankCard))

    if (valuesInBank.includes(0)) {
      const jokerPosition = bankCards.find((card) => FaceCardHelper.isJoker(card))?.location.x ?? 0
      if (jokerPosition === bankCards.length - 1) {
        return this.getPossibleMoveIfBankContainJoker(valuesInBank)
      }
    }

    return this.getPossibleMovesIfBankDontContainJoker(valuesInBank.filter((v) => v > 0))
  }

  getPossibleMovesIfBankDontContainJoker(valuesInBank: number[]) {
    const possibleCards = this.playerCards
      .filter((card) => {
        const cardColor = FaceCardHelper.getCardColor(card as CardItem)
        return cardColor === this.getColorInBank()
      })
      .filter((card) => {
        const cardValue = FaceCardHelper.getCardValue(card as CardItem)
        const isJoker = FaceCardHelper.isJoker(card as CardItem)
        return valuesInBank.includes(cardValue + 1) || valuesInBank.includes(cardValue - 1) || isJoker
      })
    return possibleCards.moveItems((item) => this.getPlaceInBank(item as CardItem))
  }

  private getPossibleMoveIfBankContainJoker(valuesInBank: number[]) {
    if (valuesInBank.length === 1) {
      return this.playerCards
        .filter((card) => {
          const cardColor = FaceCardHelper.getCardColor(card as CardItem)
          return cardColor === this.getColorInBank()
        })
        .moveItems((item) => ({ type: LocationType.BankSequenceLayout, rotation: item.location.rotation }))
    }
    const possibleCards = this.playerCards
      .filter((card) => {
        const cardColor = FaceCardHelper.getCardColor(card as CardItem)
        return cardColor === this.getColorInBank()
      })
      .filter((card) => {
        const cardValue = FaceCardHelper.getCardValue(card as CardItem)
        return (
          valuesInBank.includes(cardValue + 2) ||
          valuesInBank.includes(cardValue - 2) ||
          valuesInBank.includes(cardValue + 1) ||
          valuesInBank.includes(cardValue - 1)
        )
      })
    return possibleCards.moveItems((item) => ({ type: LocationType.BankSequenceLayout, rotation: item.location.rotation }))
  }

  private getPlaceInBank(cardItem: CardItem) {
    const cardValue = FaceCardHelper.getCardValue(cardItem)
    const isJoker = FaceCardHelper.isJoker(cardItem)
    let availablePlace: Location = { type: LocationType.BankSequenceLayout, rotation: cardItem.location.rotation }
    const bankCards = this.bankCards.getItems().sort((a, b) => FaceCardHelper.getCardValue(a as CardItem) - FaceCardHelper.getCardValue(b as CardItem))
    if (bankCards.length > 0) {
      const hightestCard: CardItem = bankCards[bankCards.length - 1] as CardItem
      if (cardValue > FaceCardHelper.getCardValue(hightestCard) || isJoker) {
        availablePlace = { ...availablePlace, x: hightestCard.location.x! + 1 }
      } else {
        for (const card of bankCards) {
          const value = FaceCardHelper.getCardValue(card as CardItem)
          const baseX = card.location.x ?? 0
          if (cardValue < value) {
            availablePlace = { ...availablePlace, x: baseX }
            break
          }
        }
      }
    }
    return availablePlace
  }

  getColorInBank(): FaceColor {
    const bankCards = this.bankCards.getItems()
    return FaceCardHelper.getCardColor(bankCards[0] as CardItem)
  }

  get playerCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }

  get bankCards() {
    return this.material(MaterialType.Card).location(LocationType.BankSequenceLayout)
  }
}
