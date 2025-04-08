import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { Memory } from '@gamepark/verso/rules/Memory'
import { RuleId } from '@gamepark/verso/rules/RuleId'
import { LocationContext, Locator, MaterialContext } from '@gamepark/react-game'
import { ItemContext } from '@gamepark/react-game/dist/locators/Locator'
import { Location } from '@gamepark/rules-api'
import { faceCardDescription } from '../material/FaceCardDescription'
import { FlipButtonDescription } from './descriptions/FlipButtonDescription'

export class FlipButtonLocator extends Locator {
  locationDescription = new FlipButtonDescription()

  getLocations({ player, rules }: MaterialContext) {
    const locations: Location[] = []
    if (!player || player !== rules.game.rule?.player) return locations

    if (rules.game.rule.id === RuleId.PlayCard) {
      if (rules.remind(Memory.Flipped)) return locations
      const hand = rules.material(MaterialType.Card).location(LocationType.PlayerHand)
      if (!hand.length) return locations
      locations.push({
        type: LocationType.FlipButton,
        parent: hand.getIndex()
      })
    }

    return locations
  }

  coordinates = { x: faceCardDescription.width / 2, y: -(faceCardDescription.height / 2), z: 1 }

  placeLocation(location: Location, context: LocationContext): string[] {
    const { rules, locators } = context
    const tile = rules.material(MaterialType.Card).getItem(location.parent!)
    return locators[tile.location.type]!.placeItem(tile, context as ItemContext).concat(super.placeLocation(location, context))
  }
}

export const flipButtonLocator = new FlipButtonLocator()
