import { CardItem, FaceColor } from '../../material/Face'

const jokerValue = 0
export const FaceCardHelper = {
  getCardColor(item: CardItem) {
    const currentId = this.getCurrentId(item)
    return Math.floor(currentId / 10) as FaceColor
  },

  getCardValue(item: CardItem) {
    const currentId = this.getCurrentId(item)
    return currentId % 10
  },

  getCurrentId(item: CardItem) {
    return item.location.rotation ? item.id.back : item.id.front
  },

  isJoker(item: CardItem): boolean {
    return this.getCardValue(item) === jokerValue
  }
}
