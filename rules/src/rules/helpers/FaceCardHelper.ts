import { CardItem, FaceColor } from '../../material/Face'

export const FaceCardHelper = {
  getCardColor(item: CardItem, currentRotation = true) {
    const currentId = this.getCurrentId(item, currentRotation)
    return Math.floor(currentId / 10) as FaceColor
  },

  getCardValue(item: CardItem, currentRotation = true) {
    const currentId = this.getCurrentId(item, currentRotation)
    return currentId % 10
  },

  getCurrentId(item: CardItem, currentRotation = true) {
    const rotated = currentRotation ? item.location.rotation : !item.location.rotation
    return rotated ? item.id.back : item.id.front
  }
}
