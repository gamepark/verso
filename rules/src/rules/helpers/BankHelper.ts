import { Location, MaterialGame, MaterialItem, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { FaceColor } from '../../material/Face'
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

  getBankScore() {
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

  getCardsToDiscard() {
    return this.getCardsSortedByXLocation().slice(Math.max(this.bankCards.length - 2, 0))
  }

  getCardsToReturnToPlayerLayout() {
    return this.getCardsSortedByXLocation().slice(0, Math.max(this.bankCards.length - 2, 0))
  }

  getCardsSortedByXLocation() {
    return this.bankCards.sort((item) => item.location.x!).getItems()
  }

  getPossibleMovesInBank() {
    const bankCards = this.bankCards.getItems()
    const valuesInBank = bankCards.map((bankCard) => FaceCardHelper.getCardValue(bankCard.id, bankCard.location.rotation))

    if (valuesInBank.includes(0)) {
      return this.getPossibleMoveIfBankContainJoker(valuesInBank)
    }

    return this.getPossibleMovesIfBankDontContainJoker(valuesInBank)
  }

  getPossibleMovesIfBankDontContainJoker(valuesInBank: number[]) {
    const possibleCards = this.playerCards
      .filter((card) => {
        const cardColor = FaceCardHelper.getCardColor(card.id, card.location.rotation)
        return cardColor === this.getColorInBank()
      })
      .filter((card) => {
        const cardValue = FaceCardHelper.getCardValue(card.id, card.location.rotation)
        return valuesInBank.includes(cardValue + 1) || valuesInBank.includes(cardValue - 1) || cardValue === 0
      })
    return possibleCards.moveItems((item) => this.getPlaceInBank(item))
  }

  private getPossibleMoveIfBankContainJoker(valuesInBank: number[]) {
    if (valuesInBank.length === 1) {
      return this.playerCards
        .filter((card) => {
          const cardColor = FaceCardHelper.getCardColor(card.id, card.location.rotation)
          return cardColor === this.getColorInBank()
        })
        .moveItems((item) => ({ type: LocationType.BankSequenceLayout, rotation: item.location.rotation }))
    }
    const moves: MaterialMove[] = []
    const possibleCards = this.playerCards
      .filter((card) => {
        const cardColor = FaceCardHelper.getCardColor(card.id, card.location.rotation)
        return cardColor === this.getColorInBank()
      })
      .filter((card) => {
        const cardValue = FaceCardHelper.getCardValue(card.id, card.location.rotation)
        return (
          valuesInBank.includes(cardValue + 2) ||
          valuesInBank.includes(cardValue - 2) ||
          valuesInBank.includes(cardValue + 1) ||
          valuesInBank.includes(cardValue - 1)
        )
      })
    possibleCards.getItems().forEach((card) => {
      const cardValue = FaceCardHelper.getCardValue(card.id, card.location.rotation)
      if (valuesInBank.includes(cardValue + 2)) {
        const baseX = this.bankCards
          .filter((item) => {
            const itemValue = FaceCardHelper.getCardValue(item.id, item.location.rotation)
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
    const valuesInBank = this.bankCards.getItems().map((bankCard) => FaceCardHelper.getCardValue(bankCard.id, bankCard.location.rotation))

    const moves: MaterialMove[] = []

    if (!valuesInBank.includes(0)) return moves

    const reorderdValues = this.reorder(valuesInBank)

    for (let i = 0; i < reorderdValues.length; i++) {
      moves.push(
        this.bankCards
          .filter((card) => FaceCardHelper.getCardValue(card.id, card.location.rotation) === reorderdValues[i])
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

    // Si tout échoue, mettre le 0 entre les plus proches
    return [...numbers.slice(0, 1), 0, ...numbers.slice(1)]
  }

  private getPlaceInBank(cardItem: MaterialItem) {
    const cardValue = FaceCardHelper.getCardValue(cardItem.id, cardItem.location.rotation)
    let availablePlace: Location = { type: LocationType.BankSequenceLayout, rotation: cardItem.location.rotation }
    const bankCards = this.bankCards
      .getItems()
      .sort((a, b) => FaceCardHelper.getCardValue(a.id, a.location.rotation) - FaceCardHelper.getCardValue(b.id, b.location.rotation))
    if (bankCards.length > 0) {
      const hightestCard = bankCards[bankCards.length - 1]
      if (cardValue > FaceCardHelper.getCardValue(hightestCard.id, hightestCard.location.rotation) || cardValue === 0) {
        availablePlace = { ...availablePlace, x: hightestCard.location.x! + 1 }
      } else {
        for (let i = 0; i < bankCards.length; i++) {
          const card = bankCards[i]
          const value = FaceCardHelper.getCardValue(card.id, card.location.rotation)
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
    return FaceCardHelper.getCardColor(bankCards[0].id, bankCards[0].location.rotation)
  }

  get playerCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }

  get bankCards() {
    return this.material(MaterialType.Card).location(LocationType.BankSequenceLayout)
  }
}
