import { MaterialGameSetup } from '@gamepark/rules-api'
import { VersoOptions } from './VersoOptions'
import { VersoRules } from './VersoRules'
import { getCardIds } from './material/Face'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { RuleId } from './rules/RuleId'
/**
 * This class creates a new Game based on the game options
 */
export class VersoSetup extends MaterialGameSetup<number, MaterialType, LocationType, VersoOptions> {
  Rules = VersoRules

  setupMaterial(_options: VersoOptions) {
    getCardIds().forEach((cardId) => {
      this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck }, id: cardId })
    })
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}

