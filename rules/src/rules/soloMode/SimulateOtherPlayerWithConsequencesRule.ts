import { ItemMove, MaterialItem, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { FaceCardHelper } from '../helpers/FaceCardHelper'
import { PlayerLayoutHelper } from '../helpers/PlayerLayoutHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerWithConsequencesRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    const playerCards = this.getPlayerLayout()
      .filter((item) => {
        const cardColor = FaceCardHelper.getCardColor(item.id, item.location.rotation)
        return cardColor === FaceCardHelper.getCardColor(this.cardInDeck.getItem()?.id, this.cardInDeck.getItem()?.location.rotation)
      })
      .sort((item) => FaceCardHelper.getCardValue(item.id, item.location.rotation))
      .getItems()
    if (playerCards.length > 0) {
      const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
      const hightestCard = playerCards[playerCards.length - 1]
      moves.push(
        this.getPlayerLayout()
          .filter((item) => item.id === playerCards[playerCards.length - 1].id)
          .moveItem((item) => ({ ...item.location, rotation: !item.location.rotation }))
      )
      if (
        playerLayoutHelper.checkIfPlayerAlreadyHaveCard({
          ...hightestCard,
          location: { ...hightestCard.location, rotation: !hightestCard.location.rotation }
        })
      ) {
        moves.push(
          this.getPlayerLayout()
            .filter((item) => item.id === playerCards[playerCards.length - 1].id)
            .moveItem((item) => ({ ...item.location, type: LocationType.Discard }))
        )
      } else {
        const { cardColor, cardValue } = this.getCardInfos(hightestCard, !hightestCard.location.rotation)
        const newPlace = playerLayoutHelper.getPlace(this.player, cardColor, cardValue)
        if (newPlace) {
          moves.push(
            this.getPlayerLayout()
              .filter((item) => item.id === playerCards[playerCards.length - 1].id)
              .moveItem((item) => ({ ...newPlace, rotation: !item.location.rotation }))
          )
        }
      }
    }

    moves.push(this.cardInDeck.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    moves.push(this.startRule(RuleId.ChooseAction))
    return moves
  }

  afterItemMove(_move: ItemMove, _context?: PlayMoveContext): MaterialMove[] {
    if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
      this.memorize(Memory.PlayerEndedGame, this.player)
      return [this.startRule(RuleId.BankLastSequence)]
    }
    return [this.startRule(RuleId.ChooseAction)]
  }

  getCardInfos(cardToPlay: MaterialItem, isRotated: boolean) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay.id, isRotated)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay.id, isRotated)
    return { cardColor, cardValue }
  }

  get cardInDeck() {
    const length = this.material(MaterialType.Card).location(LocationType.Deck).length
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .index(length - 1)
  }

  private getPlayerLayout() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }
}
