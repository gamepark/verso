import { and, isMyMove, MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'

export const versoAnimations = new MaterialGameAnimations()

versoAnimations
  .configure(and(
    (move) => isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerBankSequenceLayout,
    isMyMove()
  ))
  .skip()
