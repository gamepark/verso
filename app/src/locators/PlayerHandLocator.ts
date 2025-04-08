import { HandLocator, MaterialContext } from '@gamepark/react-game'
import { playerLayoutLocator } from './PlayerLayoutLocator'
import { Location } from '@gamepark/rules-api'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { x = 0, y = 0 } = playerLayoutLocator.getCoordinates(location, context)
    const players = context.rules.players.length
    return { x: x < 0 ? x + 15 : x - 15, y: players === 2 ? y - 0.7 : y, z: 5 }
  }
}

export const playerHandLocator = new PlayerHandLocator()
