import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItem, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { RuleId } from '@gamepark/verso/rules/RuleId'
import { ScoreType } from '@gamepark/verso/rules/ScoreType'
import { DeclareSquareHistory } from './components/DeclareSquareHistory'
import { DiscardCardHistory } from './components/DiscardCardHistory'
import { FlipCardAfterBankSequenceHistory } from './components/FlipCardAfterBankSequenceHistory'
import { FlipCardHistory } from './components/FlipCardHistory'
import { PlayCardHistory } from './components/PlayCardHistory'
import { SimulateOtherPlayerWithConsequenceHistory } from './components/SimulateOtherPlayerWithConsequenceHistory'
import { SimulateOtherPlayerWithoutConsequenceHistory } from './components/SimulateOtherPlayerWithoutConsequenceHistory'
import { ValidateSequenceHistory } from './components/ValidateSequenceHistory'

export class VersoLogs implements LogDescription {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext): MovePlayedLogDescription | undefined {
    const ruleId: RuleId = context.game.rule.id
    const actionPlayer = context.action.playerId

    const placeCardRules = [RuleId.PlayCard, RuleId.ChooseAction]

    if (placeCardRules.includes(ruleId)) {
      if (this.getMoveLocationType(move) === LocationType.PlayerLayout) {
        return {
          Component: PlayCardHistory,
          player: actionPlayer
        }
      }
      if (this.getMoveLocationType(move) === LocationType.Deck) {
        return {
          Component: FlipCardHistory,
          player: actionPlayer
        }
      }
    }
    if ((ruleId === RuleId.DiscardCard && this.getMoveLocationType(move)) === LocationType.Discard) {
      return {
        Component: DiscardCardHistory,
        player: actionPlayer
      }
    }
    if (ruleId === RuleId.FlipCardAfterBankSequence && this.getMoveLocationType(move) === LocationType.PlayerLayout && isMoveItem(move)) {
      const actualRotation = context.game.items[MaterialType.Card][move.itemIndex].location.rotation
      const cibleRotation = move.location.rotation
      if (actualRotation !== cibleRotation) {
        return {
          Component: FlipCardAfterBankSequenceHistory,
          player: actionPlayer
        }
      }
    }

    if (isCustomMoveType(CustomMoveType.Score)(move) && move.data.type === ScoreType.Sequence) {
      return {
        Component: ValidateSequenceHistory,
        player: actionPlayer
      }
    }

    if (isCustomMoveType(CustomMoveType.Score)(move) && move.data.type === ScoreType.Square) {
      return {
        Component: DeclareSquareHistory,
        player: actionPlayer
      }
    }

    if (isCustomMoveType(CustomMoveType.SimulateOtherPlayerWithoutConsequence)(move)) {
      return {
        Component: SimulateOtherPlayerWithoutConsequenceHistory,
        player: actionPlayer
      }
    }

    if (isCustomMoveType(CustomMoveType.SimulateOtherPlayerWithConsequence)(move)) {
      return {
        Component: SimulateOtherPlayerWithConsequenceHistory,
        player: actionPlayer
      }
    }
    return undefined
  }

  getMoveLocationType(move: MaterialMove) {
    return isMoveItem(move) ? move.location.type : undefined
  }
}
