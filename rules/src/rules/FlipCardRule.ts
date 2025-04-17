import { isMoveItem, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardItem, FaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'

export abstract class FlipCardRule extends PlayerTurnRule {
  flipPlayerCard(player: number, color: FaceColor) {
    const cardToFlip = this.getPlayerLayoutByPlayerId(player)
      .filter((item) => FaceCardHelper.getCardColor(item as CardItem) === color)
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
    if (FaceCardHelper.getCardColor(card.getItem() as CardItem) !== move.location.id) {
      if (playerLayoutHelper.playerHasFace(card)) {
        return [card.moveItem((item) => ({ ...item.location, type: LocationType.Discard }))]
      } else {
        const { cardColor, cardValue } = this.getCardInfos(card.getItem() as CardItem)
        const newPlace = playerLayoutHelper.getPlace(player, cardColor, cardValue)
        return [card.moveItem((item) => ({ ...newPlace, rotation: item.location.rotation }))]
      }
    } else {
      return []
    }
  }

  getCardInfos(cardToPlay: CardItem) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay)
    const isJoker = FaceCardHelper.isJoker(cardToPlay)
    return { cardColor, cardValue, isJoker }
  }

  private getPlayerLayoutByPlayerId(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }
}
