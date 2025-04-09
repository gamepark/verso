import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const cardToPlay = this.cardToPlay
    console.log('cardToPlay', cardToPlay.getItem())
    const moves: MaterialMove[] = []
    const availablePlaces = new PlayerLayoutHelper(this.game, this.player).getFreePlaces(this.player)
    availablePlaces.forEach((place) => {
      moves.push(cardToPlay.moveItem((item) => ({ ...place, rotation: item.location.rotation })))
    })
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
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .index(length - 1)
  }
}
