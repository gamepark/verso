import { Material, PositiveSequenceStrategy } from '@gamepark/rules-api'
import { CardId, CardItem, getItemFaceValue } from '../material/Face'

export class PlayerLayoutLocationStrategy extends PositiveSequenceStrategy {
  addItem(material: Material, item: CardItem) {
    const cardValue = getItemFaceValue(item)
    item.location.x = material.getItems<CardId>().reduce((sum, item) => (getItemFaceValue(item) < cardValue ? sum + 1 : sum), 0)
    super.addItem(material, item)
  }
}
