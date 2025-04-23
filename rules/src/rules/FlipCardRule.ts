import { isMoveItem, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardId, CardItem, FaceColor, getItemFaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'

export abstract class FlipCardRule extends PlayerTurnRule {
  flipPlayerCard(player: number, color: FaceColor) {
    const cardToFlip = this.getPlayerLayoutByPlayerId(player)
      .filter((item) => getItemFaceColor(item as CardItem) === color)
      .maxBy((item) => item.location.x!)
    if (!cardToFlip.length) return
    return cardToFlip.moveItem((item) => ({ ...item.location, rotation: !item.location.rotation }))
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (!isMoveItem(move) || move.location.type !== LocationType.PlayerLayout) {
      return []
    }
    const player = move.location.player!
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, player)
    const card = this.material(MaterialType.Card).index(move.itemIndex)
    const color = getItemFaceColor(card.getItem<CardId>()!)
    if (color !== move.location.id) {
      if (playerLayoutHelper.playerHasFace(card)) {
        return [card.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation }))]
      } else {
        return [card.moveItem((item) => ({ type: LocationType.PlayerLayout, player: item.location.player, id: color, rotation: item.location.rotation }))]
      }
    } else {
      return []
    }
  }

  private getPlayerLayoutByPlayerId(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }
}
