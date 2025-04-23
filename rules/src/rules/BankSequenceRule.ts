import { MaterialItem, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardItem, FaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { BankHelper } from './helpers/BankHelper'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { ScoreType } from './ScoreType'

export class BankSequenceRule extends PlayerTurnRule {
  getPlayerMoves() {
    const cardsInBank = this.bankCards

    if (cardsInBank.length === 0) {
      return this.getMovesIfBankIsEmpty()
    }

    const moves: MaterialMove[] = []

    if (cardsInBank.length > 1) {
      const bankHelper = new BankHelper(this.game, this.player)
      moves.push(
        this.customMove(CustomMoveType.Score, {
          type: ScoreType.Sequence,
          color: bankHelper.getColorInBank(),
          score: bankHelper.getBankScore(),
          player: this.player
        })
      )
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

  onCustomMove(): MaterialMove[] {
    const bankHelper = new BankHelper(this.game, this.player)
    const moves: MaterialMove[] = []

    this.memorize(Memory.BankedSequence, bankHelper.getColorInBank())

    bankHelper.getCardsToDiscard().forEach((card) => {
      moves.push(
        this.bankCards.filter((bankCard) => bankCard.id === card.id).moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation }))
      )
    })

    const cardsToReturnToPlayerLayout: CardItem[] = bankHelper.getCardsToReturnToPlayerLayout()

    for (const card of cardsToReturnToPlayerLayout) {
      const { cardColor } = this.getCardInfos(card)
      moves.push(
        this.bankCards
          .filter((bankCard) => bankCard.id === card.id)
          .moveItem((item) => ({ type: LocationType.PlayerLayout, player: this.player, id: cardColor, rotation: item.location.rotation }))
      )
    }

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

  getCardInfos(cardToPlay: CardItem) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay)
    return { cardColor, cardValue }
  }
}
