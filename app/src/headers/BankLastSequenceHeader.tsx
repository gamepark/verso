/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { Trans } from 'react-i18next'

export const BankLastSequenceHeader = () => {
  const validate = useLegalMove(isCustomMoveType(CustomMoveType.Score))
  return (
    <Trans
      defaults="header.bank.last.you"
      components={{
        validate: <PlayMoveButton move={validate} />
      }}
    />
  )
}
