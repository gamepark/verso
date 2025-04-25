/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { Trans } from 'react-i18next'

export const ChooseActionHeader = () => {
  const player = usePlayerId()
  const rules = useRules<VersoRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)
  const flip = useLegalMove((move: MaterialMove) => isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.Deck)

  if (itsMe) {
    return (
      <Trans
        defaults="header.choose.action.you"
        components={{
          flip: <PlayMoveButton move={flip} />
        }}
      />
    )
  }

  return <Trans defaults="header.choose.action.player" values={{ player: name }} />
}
