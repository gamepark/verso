import { isMoveItem, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { CardId, CardItem } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { FlipCardRule } from '../FlipCardRule'
import { FaceCardHelper } from '../helpers/FaceCardHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerRule extends FlipCardRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    this.memorize(Memory.CardToFlipValue, FaceCardHelper.getCardValue(this.cardInDeck.getItem() as CardItem))
    moves.push(this.cardInDeck.moveItem((item) => ({ ...item.location, rotation: !item.location.rotation })))
    return moves
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItem(move) && move.location.type === LocationType.Deck) {
      const moves: MaterialMove[] = []
      const cardInDeck = this.cardInDeck
      const { cardValue } = this.getCardInfos(cardInDeck.getItem<CardId>()!)
      const otherFaceValue = this.remind(Memory.CardToFlipValue)

      if (cardValue === 0 || otherFaceValue === 0 || cardValue <= otherFaceValue) {
        moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithoutConsequence))
      } else {
        moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithConsequence))
        const flip = this.flipPlayerCard(this.player, FaceCardHelper.getCardColor(cardInDeck.getItem<CardId>()!))
        if (flip) moves.push(flip)
      }
      moves.push(cardInDeck.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
      moves.push(this.startRule(RuleId.ChooseAction))
      return moves
    }
    return super.afterItemMove(move)
  }

  onRuleEnd(): MaterialMove[] {
    const moves: MaterialMove[] = []

    if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
      this.memorize(Memory.PlayerEndedGame, this.player)
      moves.push(this.startRule(RuleId.BankLastSequence))
    } else {
      moves.push(this.startRule(RuleId.ChooseAction))
    }
    return moves
  }

  get cardInDeck() {
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .maxBy((item) => item.location.x!)
  }
}
