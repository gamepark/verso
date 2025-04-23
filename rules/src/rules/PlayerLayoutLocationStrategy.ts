import { Material, MaterialItem, PositiveSequenceStrategy } from '@gamepark/rules-api'
import { CardId, CardItem } from '../material/Face'
import { FaceCardHelper } from './helpers/FaceCardHelper'

export class PlayerLayoutLocationStrategy extends PositiveSequenceStrategy {
  addItem(material: Material, item: MaterialItem) {
    const cardValue = FaceCardHelper.getCardValue(item as CardItem)
    item.location.x = material.getItems<CardId>().reduce((sum, item) => (FaceCardHelper.getCardValue(item as CardItem) < cardValue ? sum + 1 : sum), 0)
    super.addItem(material, item)
  }
}
