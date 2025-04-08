import { MaterialGameSetup } from '@gamepark/rules-api'
import { sample } from 'lodash'
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
    this.setupCards()
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }

  setupCards() {
    const cards = getCardIds()
    shuffle(cards)
    const numberOfCardsToAdd = this.players.length * 15
    cards.slice(0, numberOfCardsToAdd).forEach((cardId) => {
      this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: sample([true, false]) }, id: cardId })
    })
  }
}

function shuffle(array: any[]) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}
