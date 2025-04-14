/** @jsxImportSource @emotion/react */

import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const DeclareSquareHistory = (props: MoveComponentProps) => {
  const { context } = props
  const actionPlayer = context.action.playerId
  const name = usePlayerName(actionPlayer)

  return <Trans defaults="history.declare.square.player" values={{ player: name }} />
}
