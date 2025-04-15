import { Location, MaterialGame, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
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
    let score = 0
    this.bankCards.getItems().forEach((card) => {
      if (card.location.rotation) {
        score += 3
      } else {
        score += 1
      }
    })
    return score
  }

  getCardsToDiscard(): CardItem[] {
    return this.getCardsSortedByXLocation().slice(Math.max(this.bankCards.length - 2, 0))
  }

  getCardsToReturnToPlayerLayout(): CardItem[] {
    return this.getCardsSortedByXLocation().slice(0, Math.max(this.bankCards.length - 2, 0))
  }

  getCardsSortedByXLocation(): CardItem[] {
    return this.bankCards.sort((item) => item.location.x!).getItems()
  }

  getPossibleMovesInBank() {
    const bankCards: CardItem[] = this.bankCards.getItems()
    const valuesInBank = bankCards.map((bankCard) => FaceCardHelper.getCardValue(bankCard))

    if (valuesInBank.includes(0)) {
      const jockerPosition = bankCards.find((card) => FaceCardHelper.getCardValue(card) === 0)?.location.x ?? 0
      if(jockerPosition === bankCards.length - 1) {
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
        return valuesInBank.includes(cardValue + 1) || valuesInBank.includes(cardValue - 1) || cardValue === 0
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
    const moves: MaterialMove[] = []
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
    possibleCards.getItems().forEach((card) => {
      const cardValue = FaceCardHelper.getCardValue(card as CardItem)
      if (valuesInBank.includes(cardValue + 2)) {
        const baseX = this.bankCards
          .filter((item) => {
            const itemValue = FaceCardHelper.getCardValue(item as CardItem)
            return itemValue === cardValue + 2
          })
          .getItems()[0].location.x!
        moves.push(
          possibleCards
            .filter((item) => item.id === card.id)
            .moveItem((item) => ({ type: LocationType.BankSequenceLayout, rotation: item.location.rotation, x: baseX }))
        )
      } else {
        moves.push(
          possibleCards
            .filter((item) => item.id === card.id)
            .moveItem((item) => ({ type: LocationType.BankSequenceLayout, rotation: item.location.rotation, x: this.bankCards.length }))
        )
      }
    })
    return moves
  }

  reorderJocker() {
    const valuesInBank = this.bankCards.getItems().map((bankCard) => FaceCardHelper.getCardValue(bankCard as CardItem))

    const moves: MaterialMove[] = []

    if (!valuesInBank.includes(0)) return moves

    const reorderdValues = this.reorder(valuesInBank)

    for (let i = 0; i < reorderdValues.length; i++) {
      moves.push(
        this.bankCards
          .filter((card) => FaceCardHelper.getCardValue(card as CardItem) === reorderdValues[i])
          .moveItem((item) => ({ type: LocationType.BankSequenceLayout, rotation: item.location.rotation, x: i }))
      )
    }

    return moves
  }

  reorder(valuesInBank: number[]) {
    // Séparer le 0 des autres chiffres
    const numbers = valuesInBank.filter((n) => n !== 0).sort((a, b) => a - b)
    const hasJoker = valuesInBank.includes(0)

    // Si pas de 0, on retourne simplement les chiffres triés
    if (!hasJoker) {
      return numbers
    }

    // Vérifier les positions où inclure le 0
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i + 1] - numbers[i] > 1) {
        // Insérer le 0 ici si deux nombres ne sont pas consécutifs
        return [...numbers.slice(0, i + 1), 0, ...numbers.slice(i + 1)]
      }
    }

    // Si aucun emplacement entre des nombres non consécutifs n'est trouvé
    // Placer le 0 au début si 1 est absent, sinon à la fin si 6 est absent
    if (!numbers.includes(6)) {
      return [...numbers, 0]
    } else {
      return [0, ...numbers]
    }
  }

  private getPlaceInBank(cardItem: CardItem) {
    const cardValue = FaceCardHelper.getCardValue(cardItem)
    let availablePlace: Location = { type: LocationType.BankSequenceLayout, rotation: cardItem.location.rotation }
    const bankCards = this.bankCards.getItems().sort((a, b) => FaceCardHelper.getCardValue(a as CardItem) - FaceCardHelper.getCardValue(b as CardItem))
    if (bankCards.length > 0) {
      const hightestCard: CardItem = bankCards[bankCards.length - 1] as CardItem
      if (cardValue > FaceCardHelper.getCardValue(hightestCard) || cardValue === 0) {
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
