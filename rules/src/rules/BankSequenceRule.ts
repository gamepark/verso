import { isMoveItem, ItemMove, MaterialItem, MaterialMove, PlayerTurnRule, PlayMoveContext } from '@gamepark/rules-api'
import { FaceColor } from '../material/Face'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { BankHelper } from './helpers/BankHelper'
import { FaceCardHelper } from './helpers/FaceCardHelper'
import { PlayerLayoutHelper } from './helpers/PlayerLayoutHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class BankSequenceRule extends PlayerTurnRule {
  getPlayerMoves() {
    const cardsInBank = this.bankCards

    if (cardsInBank.length === 0) {
      return this.getMovesIfBankIsEmpty()
    }

    const moves: MaterialMove[] = []

    if (cardsInBank.length > 1) {
      moves.push(this.customMove(CustomMoveType.ValidateSequence))
    }

    moves.push(...new BankHelper(this.game, this.player).getPossibleMovesInBank())

    return moves
  }

  getMovesIfBankIsEmpty() {
    const playerLayoutHelper = new PlayerLayoutHelper(this.game, this.player)
    const cardsInSuiteSky = playerLayoutHelper.checkSuite(FaceColor.Sky)?.suites ?? []
    const cardsInSuiteLand = playerLayoutHelper.checkSuite(FaceColor.Land)?.suites ?? []
    const cardsInSuiteSea = playerLayoutHelper.checkSuite(FaceColor.Sea)?.suites ?? []
    const moves: MaterialMove[] = []

    const cardsInSuite = [...cardsInSuiteSky, ...cardsInSuiteLand, ...cardsInSuiteSea]
    cardsInSuite.forEach((cardIndex) => {
      moves.push(
        this.playerCards.index(cardIndex).moveItem(({ location }: MaterialItem) => ({ type: LocationType.BankSequenceLayout, rotation: location.rotation }))
      )
    })
    return moves
  }

  get playerCards() {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(this.player)
  }

  get bankCards() {
    return this.material(MaterialType.Card).location(LocationType.BankSequenceLayout)
  }

  afterItemMove(_move: ItemMove, _context?: PlayMoveContext): MaterialMove[] {
    if (isMoveItem(_move) && _move.location.type === LocationType.BankSequenceLayout) {
      const cardMoved = this.bankCards.index(_move.itemIndex)
      const isJocker = new FaceCardHelper(this.game).getCardValue(cardMoved.getItem()?.id, cardMoved.getItem()?.location.rotation) === 0
      if (!isJocker) {
        return new BankHelper(this.game, this.player).reorderJocker()
      }
    }
    return []
  }

  onCustomMove(): MaterialMove[] {
    const bankHelper = new BankHelper(this.game, this.player)
    const moves: MaterialMove[] = []

    this.memorize(Memory.Score, (oldScore?: number) => (oldScore ?? 0) + bankHelper.getBankScore(), this.player)

    bankHelper.getCardsToDiscard().forEach((card) => {
      moves.push(
        this.bankCards.filter((bankCard) => bankCard.id === card.id).moveItem((item) => ({ type: LocationType.Discard, rotation: item.location.rotation }))
      )
    })

    const cardsToRetunToPlayerLayout = bankHelper.getCardsToReturnToPlayerLayout()

    for (let i = cardsToRetunToPlayerLayout.length - 1; i >= 0; i--) {
      const card = cardsToRetunToPlayerLayout[i]
      const { cardColor, cardValue } = this.getCardInfos(card)
      const availablePlace = new PlayerLayoutHelper(this.game, this.player).getPlace(this.player, cardColor, cardValue)
      if (availablePlace) {
        moves.push(this.bankCards.filter((bankCard) => bankCard.id === card.id).moveItem((item) => ({ ...availablePlace, rotation: item.location.rotation })))
      }
    }

    moves.push(this.startPlayerTurn(RuleId.ChooseAction, this.nextPlayer))
    return moves
  }

  getCardInfos(cardToPlay: MaterialItem) {
    const faceCardHelper = new FaceCardHelper(this.game)
    const cardColor = faceCardHelper.getCardColor(cardToPlay.id, cardToPlay.location.rotation)
    const cardValue = faceCardHelper.getCardValue(cardToPlay.id, cardToPlay.location.rotation)
    return { cardColor, cardValue }
  }
}
