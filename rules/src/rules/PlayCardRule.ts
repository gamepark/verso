import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const cardToPlay = this.cardToPlay
    console.log('cardToPlay', cardToPlay.getItem())
    const moves: MaterialMove[] = []
    const faceCardHelper = new FaceCardHelper(this.game)
    const cardColor = faceCardHelper.getCardColor(cardToPlay.getItem()?.id, cardToPlay.getItem()?.location.rotation)
    const availablePlaces = new PlayerLayoutHelper(this.game).getFreePlaces(this.player, cardColor)
    for (const [x, y] of Object.entries(availablePlaces)) {
      moves.push(
        cardToPlay.moveItem((item) => ({
          type: LocationType.PlayerLayout,
          player: this.player,
          rotation: item.location.rotation,
          x: parseInt(x),
          y: y
        }))
      )
    }
    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout) {
      this.addPlacedCard(move.itemIndex)
      moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
    }

    return moves
  }

  addPlacedCard(index: number) {
    this.memorize(Memory.PlacedCard, index)
  }

  get cardToPlay() {
    const length = this.material(MaterialType.Card).location(LocationType.Deck).length
    return this.material(MaterialType.Card).location(LocationType.Deck).index(length - 1)
  }
}
