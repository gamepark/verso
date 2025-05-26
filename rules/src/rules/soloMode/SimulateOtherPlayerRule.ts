import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { CardId, getItemFaceColor, getItemFaceValue, JOKER } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { FlipCardRule } from '../FlipCardRule'
import { PlayerLayoutHelper } from '../helpers/PlayerLayoutHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerRule extends FlipCardRule {
  getPlayerMoves(): MaterialMove[] {
    return [this.customMove(CustomMoveType.FlipCardForAutoma)]
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (!isCustomMoveType(CustomMoveType.FlipCardForAutoma)(move)) return []

    const moves: MaterialMove[] = []
    this.memorize(Memory.CardToFlipValue, getItemFaceValue(this.cardInDeck.getItem<CardId>()!))
    moves.push(this.cardInDeck.moveItem((item) => ({ ...item.location, rotation: !item.location.rotation })))
    return moves
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.Card)(move)) {
      if (move.location.type === LocationType.Deck) {
        return this.onCardFlipped()
      } else if (move.location.type === LocationType.Discard) {
        return [this.endRule()]
      }
    }
    return super.afterItemMove(move)
  }

  onCardFlipped() {
    const moves: MaterialMove[] = []
    const cardInDeck = this.cardInDeck
    const value = getItemFaceValue(cardInDeck.getItem<CardId>()!)
    const otherFaceValue = this.remind(Memory.CardToFlipValue)

    if (otherFaceValue === JOKER || value <= otherFaceValue) {
      moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithoutConsequence, { value, otherFaceValue }))
    } else {
      moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithConsequence))
      const flip = this.flipPlayerCard(this.player, getItemFaceColor(cardInDeck.getItem<CardId>()!))
      if (flip) moves.push(flip)
    }
    moves.push(cardInDeck.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    return moves
  }

  endRule() {
    if (this.material(MaterialType.Card).location(LocationType.Deck).length) {
      return this.startRule(RuleId.ChooseAction)
    } else if (new PlayerLayoutHelper(this.game).canMakeSequence()) {
      return this.startSimultaneousRule(RuleId.BankLastSequence)
    } else {
      return this.endGame()
    }
  }

  get cardInDeck() {
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .maxBy((item) => item.location.x!)
  }
}
