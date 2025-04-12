/** @jsxImportSource @emotion/react */

import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { Trans } from 'react-i18next'

export const BankLastSequenceHeader = () => {
  const player = usePlayerId()
  const rules = useRules<VersoRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))

  if (itsMe) {
    return <Trans defaults="header.bank.last.you" >
      <PlayMoveButton move={pass} />
    </Trans>
  }

  return (
    <Trans defaults="header.bank.last.player" values={{ player: name }} />
  )
}
