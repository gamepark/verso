import { isMoveItem, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { uniq } from 'lodash'
import { CardItem } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class FlipCardAfterBankSequenceRule extends PlayerTurnRule {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const color = this.remind(Memory.BankedSequence)
    for (const player of this.getPlayersNear()) {
      const playerCards = this.getPlayerLayoutByPlayerId(player)
        .filter((item) => {
          const cardColor = FaceCardHelper.getCardColor(item as CardItem)
          return cardColor === color
        })
        .maxBy((item) => item.location.x!)
        .getItems()
      if (playerCards.length > 0) {
        moves.push(
          this.getPlayerLayoutByPlayerId(player)
            .filter((item) => item.id === playerCards[playerCards.length - 1].id)
            .moveItem((item) => ({ ...item.location, rotation: !item.location.rotation }))
        )
      }
    }

    if(moves.length === 0) {
      moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
    }

    return moves
  }

  afterItemMove(move: ItemMove, _context?: PlayMoveContext): MaterialMove[] {
    if (!isMoveItem(move) || move.location.type !== LocationType.PlayerLayout) {
      return []
    }
    const player = move.location.player!
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, player)
    const card = this.material(MaterialType.Card).index(move.itemIndex)
    if (FaceCardHelper.getCardColor(card.getItem() as CardItem) === move.location.id) {
      return this.checkSquare()
    }
    const moves: MaterialMove[] = []
    if (
      playerLayoutHelper.checkIfPlayerAlreadyHaveCard(card.getItem())
    ) {
      moves.push(card.moveItem((item) => ({ ...item.location, type: LocationType.Discard })))
    } else {
      const { cardColor, cardValue } = this.getCardInfos(card.getItem() as CardItem)
      const newPlace = playerLayoutHelper.getPlace(player, cardColor, cardValue)
      moves.push(card.moveItem(() => newPlace))
    }
    moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
    return moves
  }

  checkSquare(): MaterialMove[] {
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
    if (playerLayoutHelper.checkAndBankSquare()) {
      return [this.customMove(CustomMoveType.DeclareSquare)]
    }

    if (!playerLayoutHelper.checkSquare()) {
      this.forget(Memory.SquareBanked, this.player)
    }

    return []
  }

  getCardInfos(cardToPlay: CardItem) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay)
    return { cardColor, cardValue }
  }

  getPlayersNear() {
    if (this.player === 1) {
      return uniq([this.game.players.length, 2])
    }
    if (this.player === this.game.players.length) {
      return uniq([this.game.players.length - 1, 1])
    }
    return uniq([this.player - 1, this.player + 1])
  }

  private getPlayerLayoutByPlayerId(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }
}
