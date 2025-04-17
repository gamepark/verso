import { CardItem, FaceColor } from '../../material/Face'

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
  }
}
