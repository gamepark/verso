import { isMoveItem, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
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
      moves.push(
        this.getPlayerLayout()
          .filter((item) => item.id === playerCards[playerCards.length - 1].id)
          .moveItem((item) => ({ ...item.location, rotation: !item.location.rotation }))
      )
    } else {
      moves.push(this.cardInDeck.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
      moves.push(this.startRule(RuleId.ChooseAction))
    }
    return moves
  }

  afterItemMove(move: ItemMove): MaterialMove[] {
    const moves: MaterialMove[] = []
    if (isMoveItem(move) && move.location.type === LocationType.PlayerLayout) {
      const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
      const card = this.getPlayerLayout().index(move.itemIndex)
      const cardItem = card.getItem()!
      if (
        playerLayoutHelper.checkIfPlayerAlreadyHaveCard({
          ...cardItem,
          location: { ...cardItem.location, rotation: !cardItem.location.rotation }
        })
      ) {
        moves.push(card.moveItem((item) => ({ ...item.location, type: LocationType.Discard })))
      } else {
        const { cardColor, cardValue } = this.getCardInfos(card.getItem() as CardItem)
        const newPlace = playerLayoutHelper.getPlace(this.player, cardColor, cardValue)
        moves.push(card.moveItem((item) => ({ ...newPlace, rotation: !item.location.rotation })))
      }

      moves.push(this.cardInDeck.moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation })))
    }
    if (this.material(MaterialType.Card).location(LocationType.Deck).length === 0) {
      this.memorize(Memory.PlayerEndedGame, this.player)
      moves.push(this.startRule(RuleId.BankLastSequence))
    } else {
      moves.push(this.startRule(RuleId.ChooseAction))
    }
    return moves
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

  getCardInfos(cardToPlay: CardItem) {
    const cardColor = FaceCardHelper.getCardColor(cardToPlay)
    const cardValue = FaceCardHelper.getCardValue(cardToPlay)
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
