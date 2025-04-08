import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const hand = this.hand
    const moves: MaterialMove[] = []
    moves.push(
      hand.moveItem((item) => ({
        type: LocationType.PlayerLayout,
        player: this.player,
        rotation: item.location.rotation
      }))
    )

    if (!this.hasFlipped) {
      moves.push(hand.rotateItem((item) => !item.location.rotation))
    }
    console.log('moves', moves)
    return moves
  }

  get hasFlipped() {
    return this.remind(Memory.Flipped)
  }

  beforeItemMove(move: ItemMove) {
    console.log('beforeItemMove', move)
    if (isMoveItemType(MaterialType.Card)(move) && move.location.type !== LocationType.PlayerLayout) {
      const item = this.material(MaterialType.Card).getItem(move.itemIndex)
      console.log('item', item)
      if (item.location.rotation !== move.location.rotation) this.memorize(Memory.Flipped, true)
    }

    return []
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout) {
      this.addPlacedCard(move.itemIndex)
      moves.push(this.startPlayerTurn(RuleId.DrawCard, this.nextPlayer))
    }

    return moves
  }

  addPlacedCard(index: number) {
    this.memorize(Memory.PlacedCard, index)
  }

  get hand() {
    return this.material(MaterialType.Card).location(LocationType.PlayerHand)
  }

  onRuleEnd() {
    this.forget(Memory.Flipped)
    return []
  }
}
