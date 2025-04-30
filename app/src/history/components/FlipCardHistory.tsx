/** @jsxImportSource @emotion/react */
import { MoveComponentProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { CardItem, getFaceColor, getFaceValue, getItemFaceColor, getItemFaceValue, JOKER } from '@gamepark/verso/material/Face'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { Trans } from 'react-i18next'

export const FlipCardHistory = (props: MoveComponentProps) => {
  const { move, context } = props
  const actionPlayer = context.action.playerId
  const name = usePlayerName(actionPlayer)
  const card: CardItem = context.game.items[MaterialType.Card][move.itemIndex]
  const flipedCard: CardItem = { id: move.reveal.id, location: { type: 0, rotation: false } }
  const value = getFaceValue(move.reveal.id.back || move.reveal.id.front)
  const color = getFaceColor(move.reveal.id.back || move.reveal.id.front)
  const oldValue = getItemFaceValue(card)
  const oldColor = getItemFaceColor(card)
  const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

  if (value === JOKER) {
    return (
      <Trans defaults="history.flip.joker.player" values={{ player: name, color, oldValue, oldColor }}>
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, flipedCard)} local />
      </Trans>
    )
  }

  if (oldValue === JOKER) {
    return (
      <Trans defaults="history.flip.joker.old.player" values={{ player: name, color, value, oldColor }}>
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, flipedCard)} local />
      </Trans>
    )
  }

  return (
    <Trans defaults="history.flip.card.player" values={{ player: name, value, color, oldValue, oldColor }}>
      <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
      <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, flipedCard)} local />
    </Trans>
  )
}
