/** @jsxImportSource @emotion/react */

import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { ScoreType } from '@gamepark/verso/rules/ScoreType'
import { Trans } from 'react-i18next'

export const BankLastSequenceHeader = () => {
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))
  const validate = useLegalMove((move) => isCustomMoveType(CustomMoveType.Score)(move) && move.data.type === ScoreType.Sequence)

  return (
    <Trans defaults="header.bank.last.you">
      <PlayMoveButton move={pass} />
      <PlayMoveButton move={validate} />
    </Trans>
  )
}
