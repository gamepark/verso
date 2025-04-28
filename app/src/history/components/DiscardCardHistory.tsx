/** @jsxImportSource @emotion/react */
import { MoveComponentProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { CardItem, getItemFaceColor, getItemFaceValue, JOKER } from '@gamepark/verso/material/Face'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { Trans } from 'react-i18next'

export const DiscardCardHistory = (props: MoveComponentProps) => {
  const { move, context } = props
  const actionPlayer = context.action.playerId
  const name = usePlayerName(actionPlayer)
  const card: CardItem = context.game.items[MaterialType.Card][move.itemIndex]
  const value = getItemFaceValue(card)
  const color = getItemFaceColor(card)
  const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

  if (value === JOKER) {
    return (
      <Trans defaults="history.discard.joker.player" values={{ player: name, color }}>
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
      </Trans>
    )
  }

  return (
    <Trans defaults="history.discard.card.player" values={{ player: name, value, color }}>
      <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
    </Trans>
  )
}
