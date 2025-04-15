/** @jsxImportSource @emotion/react */

import { MoveComponentProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { CardItem } from '@gamepark/verso/material/Face'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { FaceCardHelper } from '@gamepark/verso/rules/helpers/FaceCardHelper'
import { Trans } from 'react-i18next'

export const PlayCardHistory = (props: MoveComponentProps) => {
  const { move, context } = props
  const actionPlayer = context.action.playerId
  const name = usePlayerName(actionPlayer)
  const card: CardItem = context.game.items[MaterialType.Card][move.itemIndex]
  const value = FaceCardHelper.getCardValue(card)
  const color = FaceCardHelper.getCardColor(card)
  const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

  if (value === 0) {
    return (
      <Trans defaults="history.place.joker.player" values={{ player: name, color }}>
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
      </Trans>
    )
  }

  return (
    <Trans defaults="history.place.card.player" values={{ player: name, value, color }}>
      <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
    </Trans>
  )
}
