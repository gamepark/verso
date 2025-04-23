import { MaterialItem, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardId, CardItem, getItemFaceColor, getItemFaceValue, JOKER } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { BankHelper } from './helpers/BankHelper'
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
    const playerCards = this.playerCards
    return playerCards
      .filter((card, index) => {
        const color = getItemFaceColor(card as CardItem)
        const otherValues = playerCards
          .filter((card2, index2) => index2 !== index && getItemFaceColor(card2 as CardItem) === color)
          .getItems<CardId>()
          .map(getItemFaceValue)
        if (!otherValues.length) return false
        const value = getItemFaceValue(card as CardItem)
        if (value === JOKER) return true
        return otherValues.some((otherValue) => otherValue === JOKER || otherValue === value - 1 || otherValue === value + 1)
      })
      .moveItems(({ location }: MaterialItem) => ({ type: LocationType.BankSequenceLayout, rotation: location.rotation }))
  }

  get playerCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }

  get bankCards() {
    return this.material(MaterialType.Card).location(LocationType.BankSequenceLayout)
  }

  onCustomMove(): MaterialMove[] {
    const bankHelper = new BankHelper(this.game, this.player)
    const sequenceColor = bankHelper.getColorInBank()
    const moves: MaterialMove[] = []

    this.memorize(Memory.BankedSequence, bankHelper.getColorInBank())

    const bankCards = bankHelper.bankCards

    const cardsToDiscard = bankCards.sort((item) => -item.location.x!).limit(2)
    moves.push(...cardsToDiscard.moveItems((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))

    const cardsToTakeBack = bankCards.sort((item) => item.location.x!).limit(bankCards.length - 2)
    moves.push(
      ...cardsToTakeBack.moveItems((item) => ({
        type: LocationType.PlayerLayout,
        player: this.player,
        id: sequenceColor,
        rotation: item.location.rotation
      }))
    )

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
}
