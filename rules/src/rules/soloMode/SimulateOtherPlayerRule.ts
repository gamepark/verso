import { ItemMove, Material, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { FaceCardHelper } from '../helpers/FaceCardHelper'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    moves.push(this.cardToPlay.moveItem((item) => ({ ...item.location, rotation: !item.location.rotation })))
    return moves
  }

  afterItemMove(_move: ItemMove, _context?: PlayMoveContext): MaterialMove[] {
    const { cardValue } = this.getCardInfos(this.cardToPlay)
    const otherFaceValue = FaceCardHelper.getCardValue(this.cardToPlay.getItem()?.id, !this.cardToPlay.getItem()?.location.rotation)

    if(cardValue === 0 || otherFaceValue === 0 || cardValue <= otherFaceValue) {
      return [this.startRule(RuleId.SimulateOtherPlayerWithoutConsequences)]
    }
    return [this.startRule(RuleId.SimulateOtherPlayerWithConsequences)]
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
