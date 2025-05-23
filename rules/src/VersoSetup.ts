import { MaterialGameSetup } from '@gamepark/rules-api'
import { sample, shuffle } from 'lodash'
import { Memory } from './rules/Memory'
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

  setupMaterial() {
    this.setupCards()
    for (const player of this.players) {
      this.memorize(Memory.Score, 0, player)
    }
  }

  start() {
    this.startPlayerTurn(RuleId.ChooseAction, this.players[0])
  }

  setupCards() {
    const cards = shuffle(getCardIds())
    const numberOfCardsToAdd = this.players.length === 1 ? 35 : this.players.length * 15
    cards.slice(0, numberOfCardsToAdd).forEach((cardId) => {
      this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: sample([true, false]) }, id: cardId })
    })
  }
}
