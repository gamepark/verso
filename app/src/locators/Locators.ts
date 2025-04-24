import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { playerBankSequenceLayoutLocator } from './PlayerBankSequenceLayoutLocator'
import { discardLocator } from './DiscardLocator'
import { faceCardDeckLocator } from './FaceCardDeckLocator'
import { playerLayoutLocator } from './PlayerLayoutLocator'
import { playerVictoryPointTokenStockLocator } from './PlayerVictoryPointTokenStockLocator'
import { victoryPointTokenStockLocator } from './VictoryPointTokenStockLocator'

export const Locators: Partial<Record<LocationType, Locator<number, MaterialType, LocationType>>> = {
  [LocationType.Deck]: faceCardDeckLocator,
  [LocationType.Discard]: discardLocator,
  [LocationType.PlayerLayout]: playerLayoutLocator,
  [LocationType.PlayerBankSequenceLayout]: playerBankSequenceLayoutLocator,
  [LocationType.VictoryPointTokenStock]: victoryPointTokenStockLocator,
  [LocationType.PlayerVictoryPointTokenStock]: playerVictoryPointTokenStockLocator
}
