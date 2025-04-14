/** @jsxImportSource @emotion/react */

import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { isCustomMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'

export const ValidateSequenceHistory = (props: MoveComponentProps) => {
  const { move, context } = props
  const actionPlayer = context.action.playerId
  const name = usePlayerName(actionPlayer)
  const { color, score } = isCustomMove(move) ? move.data : undefined

  return <Trans defaults="history.bank.sequence.player" values={{ player: name, color, score }} />
}
