/** @jsxImportSource @emotion/react */

import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { Trans } from 'react-i18next'

export const SimulateOtherPlayerHeader = () => {
  const flip = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.FlipCardForAutoma)(move))
  return (
    <Trans
      defaults="header.simulate.other.player.you"
      components={{
        flip: <PlayMoveButton move={flip} />
      }}
    />
  )
}
