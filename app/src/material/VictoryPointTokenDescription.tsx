import { MoneyDescription } from '@gamepark/react-game'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { VictoryPointToken } from '@gamepark/verso/material/VictoryPointToken'
import VP1 from '../images/tokens/VP1.png'
import VP3 from '../images/tokens/VP3.png'
import VP7 from '../images/tokens/VP7.png'
import VP10 from '../images/tokens/VP10.png'

class VictoryPointTokenDescription extends MoneyDescription {
  height = 2.7
  width = 2.7
  images = {
    [VictoryPointToken.victoryPointToken1]: VP1,
    [VictoryPointToken.victoryPointToken3]: VP3,
    [VictoryPointToken.victoryPointToken7]: VP7,
    [VictoryPointToken.victoryPointToken10]: VP10
  }

  stockLocation = { type: LocationType.VictoryPointTokenStock }

  staticItems = [
    { id: VictoryPointToken.victoryPointToken1, quantity: 10, location: this.stockLocation },
    { id: VictoryPointToken.victoryPointToken3, quantity: 10, location: this.stockLocation },
    { id: VictoryPointToken.victoryPointToken7, quantity: 10, location: this.stockLocation },
    { id: VictoryPointToken.victoryPointToken10, quantity: 10, location: this.stockLocation }
  ]
}

export const victoryPointTokenDescription = new VictoryPointTokenDescription()
