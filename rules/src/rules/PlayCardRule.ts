import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardId, CardItem, getItemFace, getItemFaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  onRuleStart() {
    if (this.playerAlreadyHaveFace) {
      return [this.startRule(RuleId.DiscardCard)]
    } else {
      return [this.moveCardToPlayerLayout()]
    }
  }

  get card() {
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .maxBy((item) => item.location.x!)
  }

  get playerAlreadyHaveFace() {
    const faceToPlay = getItemFace(this.card.getItem<CardId>()!)
    const playerCards = this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player).getItems<CardId>()
    return playerCards.some((card) => getItemFace(card) === faceToPlay)
  }

  moveCardToPlayerLayout(): MaterialMove {
    return this.card.moveItem((item) => ({
      type: LocationType.PlayerLayout,
      player: this.player,
      id: getItemFaceColor(item as CardItem),
      rotation: item.location.rotation
    }))
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    if (isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout) {
      return [this.endPlayerTurn()]
    }
    return []
  }

  endPlayerTurn() {
    if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
      const playersWithSequence = this.game.players.filter((player) => new PlayerLayoutHelper(this.game, player).canMakeSequence())
      return this.startSimultaneousRule(RuleId.BankLastSequence, playersWithSequence)
    } else if (this.game.players.length === 1) {
      return this.startRule(RuleId.SimulateOtherPlayer)
    } else {
      return this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer)
    }
  }
}
