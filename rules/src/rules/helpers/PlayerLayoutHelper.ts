import { Location, MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
//import { LocationType } from '../../material/LocationType'
//import { MaterialType } from '../../material/MaterialType'

export class PlayerLayoutHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player: number) {
    super(game)
  }

  getFreePlaces(_: number) {
    //const cards = this.getCards(playerId)
    const availablePlaces: Location[] = []
    availablePlaces.push({ type: LocationType.PlayerLayout, player: this.player, x: 0, y: -18 })
    availablePlaces.push({ type: LocationType.PlayerLayout, player: this.player, x: 0, y: 0 })
    availablePlaces.push({ type: LocationType.PlayerLayout, player: this.player, x: 0, y: 18 })
    return availablePlaces
  }

  /*private getCards(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }*/
}
