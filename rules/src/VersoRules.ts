import { HiddenMaterialRules, MaterialGame, MaterialItem, MaterialMove, PositiveSequenceStrategy, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { BankSequenceRule } from './rules/BankSequenceRule'
import { ChooseActionRule } from './rules/ChooseActionRule'
import { DiscardCardRule } from './rules/DiscardCardRule'
import { PlayCardRule } from './rules/PlayCardRule'
import { RuleId } from './rules/RuleId'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class VersoRules
  extends HiddenMaterialRules<number, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<number, MaterialType, LocationType>, MaterialMove<number, MaterialType, LocationType>>
{
  rules = {
    [RuleId.ChooseAction]: ChooseActionRule,
    [RuleId.PlayCard]: PlayCardRule,
    [RuleId.DiscardCard]: DiscardCardRule,
    [RuleId.BankSequence]: BankSequenceRule
  }

  locationsStrategies = {
    [MaterialType.Card]: {
      [LocationType.Deck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerLayout]: new PositiveSequenceStrategy(),
      [LocationType.BankSequenceLayout]: new PositiveSequenceStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.Card]: {
      [LocationType.Deck]: hideIfRotated,
      [LocationType.PlayerLayout]: hideIfRotated,
      [LocationType.BankSequenceLayout]: hideIfRotated
    }
  }

  giveTime(): number {
    return 60
  }
}

const hideIfRotated = (item: MaterialItem) => (item.location.rotation ? ['id.front'] : ['id.back'])
