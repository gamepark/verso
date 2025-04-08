import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { DropAreaDescription, MaterialContext } from '@gamepark/react-game'
import { isMoveItemType, Location, MaterialMove } from '@gamepark/rules-api'
import { FlipButton } from '../component/FlipButton'

export class FlipButtonDescription extends DropAreaDescription {
  height = 1.77
  width = 1.77
  borderRadius = 5

  canShortClick(move: MaterialMove, location: Location, context: MaterialContext): boolean {
    if (!isMoveItemType(MaterialType.Card)(move)) return false
    const item = context.rules.material(MaterialType.Card).getItem(move.itemIndex)
    return move.itemIndex === location.parent && item.location.rotation !== move.location.rotation
  }

  content = FlipButton
}