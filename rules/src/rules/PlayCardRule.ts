import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { CardItem } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
  card = this.cardToPlay
  playerAlreadyHaveCard = this.playerLayoutHelper.checkIfPlayerAlreadyHaveCard(this.cardToPlay.getItem())
  onRuleStart(_move: RuleMove, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove[] {
    if (this.playerAlreadyHaveCard && this.game.rule!.id === RuleId.PlayCard) {
      this.memorize(Memory.DiscardedCard, this.cardToPlay.getIndex())
      return [this.startRule(RuleId.DiscardCard)]
    }
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    if (this.playerAlreadyHaveCard) {
      return moves
    }
    const { cardColor, cardValue } = this.getCardInfos(this.card.getItem() as CardItem)
    const availablePlace = this.playerLayoutHelper.getPlace(this.player, cardColor, cardValue)
    moves.push(this.card.moveItem((item) => ({ ...availablePlace, rotation: item.location.rotation })))

    return moves
  }

  afterItemMove(move: ItemMove) {
    const moves: MaterialMove[] = []
    if (isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout && move.itemIndex === this.card.getIndex()) {
      this.checkAndBankSquare()
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

  checkAndBankSquare() {
    const isSquare = this.playerLayoutHelper.checkSquare()
    const notAlreadyBankedASquare = !this.remind(Memory.SquareBanked, this.player)

    if (isSquare && notAlreadyBankedASquare) {
      this.memorize(Memory.SquareBanked, 1, this.player)
      this.memorize(Memory.Score, (oldScore?: number) => (oldScore ?? 0) + 7, this.player)
    }
  }

  getCardInfos(cardToPlay: CardItem) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay)
    return { cardColor, cardValue }
  }

  get cardToPlay() {
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .maxBy((item) => item.location.x!)
  }
}
