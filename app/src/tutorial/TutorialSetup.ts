import { getCardIds } from '@gamepark/verso/material/Face'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { VersoSetup } from '@gamepark/verso/VersoSetup'
import { sample } from 'lodash'

export const me = 1
export const opponent = 2
export class TutorialSetup extends VersoSetup {
  setupCards() {
    const cards = getCardIds().slice(0, 25)
    cards.forEach((cardId) => {
      this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: sample([true, false]) }, id: cardId })
    })
    this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: false }, id: { front: 30, back: 24 } })
    this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: true }, id: { front: 11, back: 22 } })
    this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: true }, id: { front: 23, back: 34 } })
    this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: false }, id: { front: 33, back: 24 } })
    this.material(MaterialType.Card).createItem({ location: { type: LocationType.Deck, rotation: false }, id: { front: 14, back: 35 } })
  }
}
