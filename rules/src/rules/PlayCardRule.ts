import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardId, getItemFaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
  card = this.cardToPlay
  playerAlreadyHaveCard = this.playerLayoutHelper.checkIfPlayerAlreadyHaveCard(this.cardToPlay.getItem())
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    if (this.game.rule!.id === RuleId.PlayCard) {
      if (this.playerAlreadyHaveCard) {
        moves.push(this.startRule(RuleId.DiscardCard))
      } else {
        moves.push(this.moveCardToAvailablePlace())
      }
    }
    return moves
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    if (this.playerAlreadyHaveCard) {
      return moves
    }
    moves.push(this.moveCardToAvailablePlace())

    return moves
  }

  moveCardToAvailablePlace(): MaterialMove {
    const color = getItemFaceColor(this.card.getItem<CardId>()!)
    return this.card.moveItem((item) => ({ type: LocationType.PlayerLayout, player: this.player, id: color, rotation: item.location.rotation }))
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout && move.itemIndex === this.card.getIndex()) {
      if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
        this.memorize(Memory.PlayerEndedGame, this.player)
      }
      if (this.remind(Memory.PlayerEndedGame)) {
        moves.push(this.startPlayerTurn(RuleId.BankLastSequence, this.nextPlayer))
      } else {
        if (this.game.players.length === 1) {
          moves.push(this.startRule(RuleId.SimulateOtherPlayer))
        } else {
          moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
        }
      }
    }

    return moves
  }

  get cardToPlay() {
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .maxBy((item) => item.location.x!)
  }
}
