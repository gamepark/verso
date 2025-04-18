/** @jsxImportSource @emotion/react */

import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { ScoreType } from '@gamepark/verso/rules/ScoreType'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { Trans } from 'react-i18next'

export const BankSequenceHeader = () => {
  const player = usePlayerId()
  const rules = useRules<VersoRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  const validate = useLegalMove((move) => isCustomMoveType(CustomMoveType.Score)(move) && move.data.type === ScoreType.Sequence)

  if (itsMe) {
    if (validate) {
      return (
        <Trans defaults="header.bank.validate.you">
          <PlayMoveButton move={validate} />
        </Trans>
      )
    }
    return <Trans defaults="header.bank.you" />
  }

  return <Trans defaults="header.bank.player" values={{ player: name }} />
}
