import { isMoveItem, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { CardItem } from '../../material/Face'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { FaceCardHelper } from '../helpers/FaceCardHelper'
import { PlayerLayoutHelper } from '../helpers/PlayerLayoutHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class SimulateOtherPlayerRule extends PlayerTurnRule {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = []
    this.memorize(Memory.CardToFlipValue, FaceCardHelper.getCardValue(this.cardInDeck.getItem() as CardItem))
    moves.push(this.cardInDeck.moveItem((item) => ({ ...item.location, rotation: !item.location.rotation })))
    return moves
  }

  afterItemMove(move: MaterialMove): MaterialMove[] {
    if (isMoveItem(move) && move.location.type === LocationType.Deck) {
      const { cardValue } = this.getCardInfos(this.cardInDeck.getItem() as CardItem)
      const otherFaceValue = this.remind(Memory.CardToFlipValue)

      if (cardValue === 0 || otherFaceValue === 0 || cardValue <= otherFaceValue) {
        return this.nothingHappen()
      }
      return this.playerFlipCard()
    }
    return []
  }

  nothingHappen(): MaterialMove[] {
    const moves: MaterialMove[] = []
    moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithoutConsequence))
    moves.push(this.cardInDeck.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    moves.push(this.startRule(RuleId.ChooseAction))
    return moves
  }

  playerFlipCard(): MaterialMove[] {
    const moves: MaterialMove[] = []
    moves.push(this.customMove(CustomMoveType.SimulateOtherPlayerWithConsequence))

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

  onRuleEnd(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
    if (playerLayoutHelper.checkAndBankSquare()) {
      moves.push(this.customMove(CustomMoveType.DeclareSquare))
    }

    if (!playerLayoutHelper.checkSquare()) {
      this.forget(Memory.SquareBanked, this.player)
    }

    if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
      this.memorize(Memory.PlayerEndedGame, this.player)
      moves.push(this.startRule(RuleId.BankLastSequence))
    } else {
      moves.push(this.startRule(RuleId.ChooseAction))
    }
    return moves
  }

  getCardInfos(cardToPlay: CardItem, currentRotation = true) {
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
