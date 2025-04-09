import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { FaceColor } from '../../material/Face'
//import { LocationType } from '../../material/LocationType'
//import { MaterialType } from '../../material/MaterialType'

export class PlayerLayoutHelper extends MaterialRulesPart {
  constructor(game: MaterialGame) {
    super(game)
  }

  getFreePlaces(_: number, cardColor: FaceColor) {
    //const cards = this.getCards(playerId)
    const availablePlaces: Record<number, number> = {}
    switch (cardColor) {
      case FaceColor.Sky:
        availablePlaces[-8] = 0
        break
      case FaceColor.Land:
        availablePlaces[0] = 0
        break
      case FaceColor.Sea:
        availablePlaces[8] = 0
        break
    }
    return availablePlaces
  }

  /*private getCards(playerId: number) {
    return this.material(MaterialType.Card).location(LocationType.PlayerLayout).player(playerId)
  }*/
}
