import { isMoveItem, ItemMove, MaterialItem, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { FaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { BankHelper } from './helpers/BankHelper'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class BankSequenceRule extends PlayerTurnRule {
  getPlayerMoves() {
    const cardsInBank = this.bankCards

    if (cardsInBank.length === 0) {
      return this.getMovesIfBankIsEmpty()
    }

    const moves: MaterialMove[] = []

    if (cardsInBank.length > 1) {
      moves.push(this.customMove(CustomMoveType.ValidateSequence))
    }

    moves.push(...new BankHelper(this.game, this.player).getPossibleMovesInBank())

    return moves
  }

  getMovesIfBankIsEmpty() {
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
    const cardsInSuiteSky = playerLayoutHelper.checkSuite(FaceColor.Sky)?.suites ?? []
    const cardsInSuiteLand = playerLayoutHelper.checkSuite(FaceColor.Land)?.suites ?? []
    const cardsInSuiteSea = playerLayoutHelper.checkSuite(FaceColor.Sea)?.suites ?? []
    const moves: MaterialMove[] = []

    const cardsInSuite = [...cardsInSuiteSky, ...cardsInSuiteLand, ...cardsInSuiteSea]
    cardsInSuite.forEach((cardIndex) => {
      moves.push(
        this.playerCards.index(cardIndex).moveItem(({ location }: MaterialItem) => ({ type: LocationType.BankSequenceLayout, rotation: location.rotation }))
      )
    })
    return moves
  }

  get playerCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }

  get bankCards() {
    return this.material(MaterialType.Card).location(LocationType.BankSequenceLayout)
  }

  beforeItemMove(_move: ItemMove): MaterialMove[] {
    if (this.isLegalMove(this.player, _move)) {
      this.forget(Memory.Reordered)
    }
    return []
  }

  afterItemMove(_move: ItemMove, _context?: PlayMoveContext): MaterialMove[] {
    const reordered = this.remind(Memory.Reordered)
    if (!reordered && isMoveItem(_move) && _move.location.type === LocationType.BankSequenceLayout) {
      this.memorize(Memory.Reordered, true)
      return new BankHelper(this.game, this.player).reorderJocker()
    }
    return []
  }

  onCustomMove(): MaterialMove[] {
    const bankHelper = new BankHelper(this.game, this.player)
    const moves: MaterialMove[] = []

    this.memorize(Memory.BankedSequence, bankHelper.getColorInBank())
    this.memorize(Memory.Score, (oldScore?: number) => (oldScore ?? 0) + bankHelper.getBankScore(), this.player)

    bankHelper.getCardsToDiscard().forEach((card) => {
      moves.push(
        this.bankCards.filter((bankCard) => bankCard.id === card.id).moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation }))
      )
    })

    const cardsToRetunToPlayerLayout = bankHelper.getCardsToReturnToPlayerLayout()

    for (let i = cardsToRetunToPlayerLayout.length - 1; i >= 0; i--) {
      const card = cardsToRetunToPlayerLayout[i]
      const { cardColor, cardValue } = this.getCardInfos(card)
      const availablePlace = new PlayerLayoutHelper(this.game, this.player).getPlace(this.player, cardColor, cardValue)
      if (availablePlace) {
        moves.push(this.bankCards.filter((bankCard) => bankCard.id === card.id).moveItem((item) => ({ ...availablePlace, rotation: item.location.rotation })))
      }
    }
    this.forget(Memory.SquareBanked, this.player)
    if (this.remind(Memory.PlayerEndedGame)) {
      if (this.remind(Memory.PlayerEndedGame) === this.player) {
        moves.push(this.endGame())
      } else {
        moves.push(this.startPlayerTurn(RuleId.BankLastSequence, this.nextPlayer))
      }
    } else {
      if (this.game.players.length === 1) {
        moves.push(this.startRule(RuleId.SimulateOtherPlayer))
      } else {
        moves.push(this.startRule(RuleId.FlipCardAfterBankSequence))
      }
    }
    return moves
  }

  getCardInfos(cardToPlay: MaterialItem) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay.id, cardToPlay.location.rotation)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay.id, cardToPlay.location.rotation)
    return { cardColor, cardValue }
  }
}
