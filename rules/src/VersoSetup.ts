import { MaterialGameSetup } from '@gamepark/rules-api'
import { sample, shuffle } from 'lodash'
import { VictoryPointToken } from './material/VictoryPointToken'
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
      for(let i = 0; i < 5; i++) {
        this.material(MaterialType.Card).createItem({ location: { type: LocationType.PlayerLayout, id: 1, x: i, player: player }, id: `1${i}` })
      }
      for(let i = 0; i < 5; i++) {
        this.material(MaterialType.Card).createItem({ location: { type: LocationType.PlayerLayout, id: 2, x: i, player: player }, id: `2${i}` })
      }
      for(let i = 0; i < 5; i++) {
        this.material(MaterialType.Card).createItem({ location: { type: LocationType.PlayerLayout, id: 3, x: i, player: player }, id: `3${i}` })
      }

      this.material(MaterialType.VictoryPointToken).createItem({
        id: VictoryPointToken.victoryPointToken1,
        location: {
          type: LocationType.PlayerVictoryPointTokenStock,
          player: player
        },
        quantity: 3
      })
      this.material(MaterialType.VictoryPointToken).createItem({
        id: VictoryPointToken.victoryPointToken3,
        location: {
          type: LocationType.PlayerVictoryPointTokenStock,
          player: player
        },
        quantity: 3
      })
      this.material(MaterialType.VictoryPointToken).createItem({
        id: VictoryPointToken.victoryPointToken7,
        location: {
          type: LocationType.PlayerVictoryPointTokenStock,
          player: player
        },
        quantity: 3
      })
      this.material(MaterialType.VictoryPointToken).createItem({
        id: VictoryPointToken.victoryPointToken10,
        location: {
          type: LocationType.PlayerVictoryPointTokenStock,
          player: player
        },
        quantity: 3
      })
      for(let i = 0; i < 5; i++) {
        this.material(MaterialType.Card).createItem({ location: { type: LocationType.PlayerBankSequenceLayout, player, x: i }, id: `3${i}` })
      }
    }
    for(let i = 0; i < 5; i++) {
      this.material(MaterialType.Card).createItem({ location: { type: LocationType.Discard, x: i }, id: `3${i}` })
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
