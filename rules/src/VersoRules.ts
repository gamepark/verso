import {
  CompetitiveScore,
  CustomMove,
  getEnumValues,
  HiddenMaterialRules,
  isMoveItem,
  ItemMove,
  MaterialGame,
  MaterialItem,
  MaterialMove,
  MaterialMoveBuilder,
  PositiveSequenceStrategy,
  TimeLimit
} from '@gamepark/rules-api'
import { CardId, FaceColor, getItemFaceColor } from './material/Face'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { victoryPointTokens } from './material/VictoryPointToken'
import { BankLastSequenceRule } from './rules/BankLastSequenceRule'
import { BankSequenceLayoutLocationStrategy } from './rules/BankSequenceLayoutLocationStrategy'
import { BankSequenceRule } from './rules/BankSequenceRule'
import { ChooseActionRule } from './rules/ChooseActionRule'
import { CustomMoveType } from './rules/CustomMoveType'
import { DiscardCardRule } from './rules/DiscardCardRule'
import { FlipCardAfterBankSequenceRule } from './rules/FlipCardAfterBankSequenceRule'
import { Memory } from './rules/Memory'
import { PlayCardRule } from './rules/PlayCardRule'
import { PlayerLayoutLocationStrategy } from './rules/PlayerLayoutLocationStrategy'
import { RuleId } from './rules/RuleId'
import { ScoreType, Scoring } from './rules/ScoreType'
import { SimulateOtherPlayerRule } from './rules/soloMode/SimulateOtherPlayerRule'
import customMove = MaterialMoveBuilder.customMove

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class VersoRules
  extends HiddenMaterialRules<number, MaterialType, LocationType>
  implements
    TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>>,
    CompetitiveScore<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>, number>
{
  rules = {
    [RuleId.ChooseAction]: ChooseActionRule,
    [RuleId.PlayCard]: PlayCardRule,
    [RuleId.DiscardCard]: DiscardCardRule,
    [RuleId.BankSequence]: BankSequenceRule,
    [RuleId.FlipCardAfterBankSequence]: FlipCardAfterBankSequenceRule,
    [RuleId.BankLastSequence]: BankLastSequenceRule,
    [RuleId.SimulateOtherPlayer]: SimulateOtherPlayerRule
  }

  locationsStrategies = {
    [MaterialType.Card]: {
      [LocationType.Deck]: new PositiveSequenceStrategy(),
      [LocationType.Discard]: new PositiveSequenceStrategy(),
      [LocationType.PlayerLayout]: new PlayerLayoutLocationStrategy(),
      [LocationType.BankSequenceLayout]: new BankSequenceLayoutLocationStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.Card]: {
      [LocationType.Deck]: hideIfRotated,
      [LocationType.Discard]: hideIfRotated,
      [LocationType.PlayerLayout]: hideIfRotated,
      [LocationType.BankSequenceLayout]: hideIfRotated
    }
  }

  protected afterItemMove(move: ItemMove) {
    if (isMoveItem(move) && move.location.type === LocationType.PlayerLayout) {
      const card = this.material(MaterialType.Card).getItem<CardId>(move.itemIndex)
      const player = card.location.player!
      const color = getItemFaceColor(card)
      const otherColors = getEnumValues(FaceColor).filter((otherColor) => otherColor !== color)
      if (color === card.location.id && this.lineSize(player, color) === 3 && otherColors.every((otherColor) => this.lineSize(player, otherColor) >= 3)) {
        return [customMove(CustomMoveType.Score, { type: ScoreType.Square, score: 7, player })]
      }
    }
    return []
  }

  protected onCustomMove(move: CustomMove) {
    if (move.type === CustomMoveType.Score) {
      const { player, score } = move.data as Scoring
      this.getMemory(player).memorize<number>(Memory.Score, (previousScore) => previousScore + score)
      return this.material(MaterialType.VictoryPointToken)
        .money(victoryPointTokens)
        .addMoney(score, { type: LocationType.PlayerVictoryPointTokenStock, player: player })
    }
    return []
  }

  lineSize(player: number, color: FaceColor) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(player).locationId(color).length
  }

  giveTime(): number {
    return 60
  }

  getScore(playerId: number): number {
    return this.remind(Memory.Score, playerId) || 0
  }
}

const hideIfRotated = (item: MaterialItem) => (item.location.rotation ? ['id.front'] : ['id.back'])
