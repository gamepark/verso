import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardId, CardItem, getItemFace, getItemFaceColor, getItemFaceValue, isValidSequence, JOKER } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { BankHelper } from './helpers/BankHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { ScoreType } from './ScoreType'

export class BankSequenceRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = this.cardsICanBank.moveItems((item) => ({
      type: LocationType.BankSequenceLayout,
      rotation: item.location.rotation
    }))

    const bankCards = this.bankCards
    if (bankCards.length > 1) {
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

    return moves
  }

  get cardsICanBank() {
    const sequence = this.bankCards.getItems<CardId>().map(getItemFace)
    const playerCards = this.playerCards
    if (!sequence.length) {
      return playerCards.filter((card, index) => {
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
    } else {
      return playerCards.filter((item) => isValidSequence([...sequence, getItemFace(item as CardItem)]))
    }
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
