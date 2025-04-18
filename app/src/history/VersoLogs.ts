import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItem, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { RuleId } from '@gamepark/verso/rules/RuleId'
import { ScoreType } from '@gamepark/verso/rules/ScoreType'
import { DeclareSquareHistory } from './components/DeclareSquareHistory'
import { PlayCardHistory } from './components/PlayCardHistory'
import { SimulateOtherPlayerWithConsequenceHistory } from './components/SimulateOtherPlayerWithConsequenceHistory'
import { SimulateOtherPlayerWithoutConsequenceHistory } from './components/SimulateOtherPlayerWithoutConsequenceHistory'
import { ValidateSequenceHistory } from './components/ValidateSequenceHistory'

export class VersoLogs implements LogDescription {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext): MovePlayedLogDescription | undefined {
    const ruleId: RuleId = context.game.rule.id
    const actionPlayer = context.action.playerId

    const placeCardRules = [RuleId.PlayCard, RuleId.ChooseAction]

    if (placeCardRules.includes(ruleId) && this.getMoveLocationType(move) === LocationType.PlayerLayout) {
      return {
        Component: PlayCardHistory,
        player: actionPlayer
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
