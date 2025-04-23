import { isMoveItem, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { CardId, getItemFaceColor, getItemFaceValue, JOKER } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { FlipCardRule } from '../FlipCardRule'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerRule extends FlipCardRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    this.memorize(Memory.CardToFlipValue, getItemFaceValue(this.cardInDeck.getItem<CardId>()!))
    moves.push(this.cardInDeck.moveItem((item) => ({ ...item.location, rotation: !item.location.rotation })))
    return moves
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItem(move) && move.location.type === LocationType.Deck) {
      const moves: MaterialMove[] = []
      const cardInDeck = this.cardInDeck
      const value = getItemFaceValue(cardInDeck.getItem<CardId>()!)
      const otherFaceValue = this.remind(Memory.CardToFlipValue)

      if (otherFaceValue === JOKER || value <= otherFaceValue) {
        moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithoutConsequence))
      } else {
        moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithConsequence))
        const flip = this.flipPlayerCard(this.player, getItemFaceColor(cardInDeck.getItem<CardId>()!))
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
