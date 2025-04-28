/** @jsxImportSource @emotion/react */

import { MoveComponentProps } from '@gamepark/react-game'
import { JOKER } from '@gamepark/verso/material/Face'
import { Trans } from 'react-i18next'

export const SimulateOtherPlayerWithoutConsequenceHistory = (props: MoveComponentProps) => {
  const { move } = props

  if (move.data.value === JOKER || move.data.otherFaceValue === JOKER) {
    return <Trans defaults="history.simulate.other.player.without.consequence.joker" />
  }
  return <Trans defaults="history.simulate.other.player.without.consequence" />
}
