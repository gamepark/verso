import { MaterialGameSetup } from '@gamepark/rules-api'
import { VersoOptions } from './VersoOptions'
import { VersoRules } from './VersoRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class VersoSetup extends MaterialGameSetup<number, MaterialType, LocationType, VersoOptions> {
  Rules = VersoRules

  setupMaterial(_options: VersoOptions) {
    // TODO
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}

