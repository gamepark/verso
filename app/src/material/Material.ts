import { MaterialDescription } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { faceCardDescription } from './FaceCardDescription'
import { victoryPointTokenDescription } from './VictoryPointTokenDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.Card]: faceCardDescription,
  [MaterialType.VictoryPointToken]: victoryPointTokenDescription
}
