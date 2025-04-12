import { isMoveItemType, ItemMove, Material, MaterialMove, PlayerTurnRule, PlayMoveContext, RuleMove, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
  card = this.cardToPlay
  onRuleStart(_move: RuleMove, _previousRule?: RuleStep, _context?: PlayMoveContext): MaterialMove[] {
    const playerAlreadyHaveCard = this.playerLayoutHelper.checkIfPlayerAlreadyHaveCard(this.cardToPlay.getItem())
    if (playerAlreadyHaveCard && this.game.rule!.id === RuleId.PlayCard) {
      this.memorize(Memory.DiscardedCard, this.cardToPlay.getIndex())
      return [this.startRule(RuleId.DiscardCard)]
    }
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const { cardColor, cardValue } = this.getCardInfos(this.card)
    const availablePlace = this.playerLayoutHelper.getPlace(this.player, cardColor, cardValue)
    if (availablePlace) {
      moves.push(this.card.moveItem((item) => ({ ...availablePlace, rotation: item.location.rotation })))
    }
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
        moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
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

  getCardInfos(cardToPlay: Material) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay.getItem()?.id, cardToPlay.getItem()?.location.rotation)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay.getItem()?.id, cardToPlay.getItem()?.location.rotation)
    return { cardColor, cardValue }
  }

  get cardToPlay() {
    const length = this.material(MaterialType.Card).location(LocationType.Deck).length
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .index(length - 1)
  }
}
