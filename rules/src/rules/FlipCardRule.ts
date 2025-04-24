import { isMoveItem, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardId, CardItem, FaceColor, getFaceColor, getItemFace, getItemFaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'

export abstract class FlipCardRule extends PlayerTurnRule {
  flipPlayerCard(player: number, color: FaceColor) {
    const cardToFlip = new PlayerLayoutHelper(this.game, player).playerCards
      .filter((item) => getItemFaceColor(item as CardItem) === color)
      .maxBy((item) => item.location.x!)
    if (!cardToFlip.length) return
    return cardToFlip.moveItem((item) => ({ ...item.location, rotation: !item.location.rotation }))
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItem(move) || move.location.type !== LocationType.PlayerLayout) return []

    const card = this.material(MaterialType.Card).index(move.itemIndex)
    const cardItem = card.getItem<CardId>()!
    const face = getItemFace(cardItem)
    const color = getFaceColor(face)

    if (color === move.location.id) return []

    const otherPlayerCards = this.material(MaterialType.Card)
      .location(LocationType.PlayerLayout)
      .player(move.location.player)
      .index((index) => index !== move.itemIndex)
    const hasAlreadyFace = otherPlayerCards.getItems<CardId>().some((card) => getItemFace(card) === face)

    if (hasAlreadyFace) {
      return [card.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation }))]
    } else {
      return [card.moveItem((item) => ({ type: LocationType.PlayerLayout, player: item.location.player, id: color, rotation: item.location.rotation }))]
    }
  }
}
