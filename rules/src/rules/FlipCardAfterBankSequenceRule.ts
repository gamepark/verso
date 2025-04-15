import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
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
        .sort((item) => FaceCardHelper.getCardValue(item as CardItem))
        .getItems()
      if (playerCards.length > 0) {
        const playerLayoutHelper = new PlayerLayoutHelper(this.game, player)
        const hightestCard = playerCards[playerCards.length - 1]
        moves.push(
          this.getPlayerLayoutByPlayerId(player)
            .filter((item) => item.id === playerCards[playerCards.length - 1].id)
            .moveItem((item) => ({ ...item.location, rotation: !item.location.rotation }))
        )
        if (
          playerLayoutHelper.checkIfPlayerAlreadyHaveCard({
            ...hightestCard,
            location: { ...hightestCard.location, rotation: !hightestCard.location.rotation }
          })
        ) {
          moves.push(
            this.getPlayerLayoutByPlayerId(player)
              .filter((item) => item.id === playerCards[playerCards.length - 1].id)
              .moveItem((item) => ({ ...item.location, type: LocationType.Discard }))
          )
        } else {
          const { cardColor, cardValue } = this.getCardInfos(hightestCard as CardItem, false)
          const newPlace = playerLayoutHelper.getPlace(player, cardColor, cardValue)
          moves.push(
            this.getPlayerLayoutByPlayerId(player)
              .filter((item) => item.id === playerCards[playerCards.length - 1].id)
              .moveItem((item) => ({ ...newPlace, rotation: !item.location.rotation }))
          )
        }
      }
    }

    moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))

    return moves
  }

  onRuleEnd(): MaterialMove[] {
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
    if (playerLayoutHelper.checkAndBankSquare()) {
      return [this.customMove(CustomMoveType.DeclareSquare)]
    }

    if (!playerLayoutHelper.checkSquare()) {
      this.forget(Memory.SquareBanked, this.player)
    }

    return []
  }

  getCardInfos(cardToPlay: CardItem, currentRotation: boolean) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay, currentRotation)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay, currentRotation)
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
