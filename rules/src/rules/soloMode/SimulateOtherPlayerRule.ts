import { ItemMove, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { CardItem } from '../../material/Face'
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
    const { cardValue } = this.getCardInfos(this.cardToPlay.getItem() as CardItem)
    const otherFaceValue = FaceCardHelper.getCardValue(this.cardToPlay.getItem() as CardItem, false)

    if (cardValue === 0 || otherFaceValue === 0 || cardValue <= otherFaceValue) {
      return [this.startRule(RuleId.SimulateOtherPlayerWithoutConsequences)]
    }
    return [this.startRule(RuleId.SimulateOtherPlayerWithConsequences)]
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
