/** @jsxImportSource @emotion/react */

import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { Memory } from '@gamepark/verso/rules/Memory'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { Trans } from 'react-i18next'

export const PlayCardHeader = () => {
  const player = usePlayerId()
  const rules = useRules<VersoRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  const flip = useLegalMove((move) => isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerHand)
  const flipped = rules.remind(Memory.Flipped)

  if (itsMe) {
    if (flipped) {
      return <Trans defaults="header.place.you" values={{ player: name }} />
    }
    return (
      <Trans defaults="header.flip.you">
        <PlayMoveButton move={flip} />
      </Trans>
    )
  }

  if (flipped) {
    return <Trans defaults="header.place.player" values={{ player: name }} />
  }

  return <Trans defaults="header.flip.player" values={{ player: name }} />
}
