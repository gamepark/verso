import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardItem } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { FaceCardHelper } from '../helpers/FaceCardHelper'
import { PlayerLayoutHelper } from '../helpers/PlayerLayoutHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerWithConsequencesRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []

    const playerCards = this.getPlayerLayout()
      .filter((item) => {
        const cardColor = FaceCardHelper.getCardColor(item as CardItem)
        return cardColor === FaceCardHelper.getCardColor(this.cardInDeck.getItem() as CardItem)
      })
      .sort((item) => FaceCardHelper.getCardValue(item as CardItem))
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
        const { cardColor, cardValue } = this.getCardInfos(hightestCard as CardItem, false)
        const newPlace = playerLayoutHelper.getPlace(this.player, cardColor, cardValue)
        moves.push(
          this.getPlayerLayout()
            .filter((item) => item.id === playerCards[playerCards.length - 1].id)
            .moveItem((item) => ({ ...newPlace, rotation: !item.location.rotation }))
        )
      }
    }

    moves.push(this.cardInDeck.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    moves.push(this.startRule(RuleId.ChooseAction))
    return moves
  }

  afterItemMove(): MaterialMove[] {
    if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
      this.memorize(Memory.PlayerEndedGame, this.player)
      return [this.startRule(RuleId.BankLastSequence)]
    }
    return [this.startRule(RuleId.ChooseAction)]
  }

  onRuleEnd(): MaterialMove[] {
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
    if (playerLayoutHelper.checkAndBankSquare()) {
      return [this.customMove(CustomMoveType.DeclareSquare)]
    }

    if (!playerLayoutHelper.checkSquare()) {
      this.forget(Memory.SquareBanked, this.player)
    }

    return []
  }

  getCardInfos(cardToPlay: CardItem, currentRotation: boolean) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay, currentRotation)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay, currentRotation)
    return { cardColor, cardValue }
  }

  get cardInDeck() {
    return this.material(MaterialType.Card)
      .location(LocationType.Deck)
      .maxBy((item) => item.location.x!)
  }

  private getPlayerLayout() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }
}
