import { MaterialDescription } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { faceCardDescription } from './FaceCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.Card]: faceCardDescription
}
