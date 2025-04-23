import { Material, MaterialItem, PositiveSequenceStrategy } from '@gamepark/rules-api'
import { CardId, CardItem } from '../material/Face'
import { FaceCardHelper } from './helpers/FaceCardHelper'

const JOKER = 0

export class BankSequenceLayoutLocationStrategy extends PositiveSequenceStrategy {
  addItem(material: Material, item: MaterialItem) {
    const cardValue = FaceCardHelper.getCardValue(item as CardItem)
    const sequence = material.sort((item) => item.location.x!).getItems<CardId>()
    const values = sequence.map((item) => FaceCardHelper.getCardValue(item))
    if (values.includes(JOKER)) {
      if (sequence.length === 1) {
        if (cardValue === 1) {
          item.location.x = 0
        }
      } else {
        const indexOfJoker = values.indexOf(JOKER)
        const jokerValue = values[0] === JOKER ? values[1] - 1 : values[indexOfJoker - 1] + 1
        if (jokerValue === cardValue) {
          if (values[0] !== 1 && indexOfJoker < values.length / 2) {
            item.location.x = indexOfJoker + 1
            this.putJokerToStart(sequence, indexOfJoker)
          } else {
            item.location.x = indexOfJoker
            this.putJokerToEnd(sequence, indexOfJoker)
          }
        } else {
          if (cardValue < jokerValue) {
            item.location.x = 0
            if (indexOfJoker !== 0 && cardValue !== values[0] - 1) {
              this.putJokerToStart(sequence, indexOfJoker)
            }
          } else {
            if (indexOfJoker !== values.length - 1 && cardValue !== values[values.length - 1] + 1) {
              this.putJokerToEnd(sequence, indexOfJoker)
            }
          }
        }
      }
    } else if (sequence.length > 0 && cardValue < values[0] && (cardValue !== JOKER || values[values.length - 1] === 6)) {
      item.location.x = 0
    }
    super.addItem(material, item)
  }

  putJokerToStart(sequence: MaterialItem[], indexOfJoker: number) {
    for (let i = 0; i < indexOfJoker; i++) {
      sequence[i].location.x!++
    }
    sequence[indexOfJoker].location.x = 0
  }

  putJokerToEnd(sequence: MaterialItem[], indexOfJoker: number) {
    for (let i = sequence.length - 1; i > indexOfJoker; i--) {
      sequence[i].location.x!--
    }
    sequence[indexOfJoker].location.x = sequence.length - 1
  }
}
