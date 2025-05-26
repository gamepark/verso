/** @jsxImportSource @emotion/react */
import { MoveComponentProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { MaterialMoveBuilder, MoveItem } from '@gamepark/rules-api'
import { CardItem, getItemFaceColor, getItemFaceValue, JOKER } from '@gamepark/verso/material/Face'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { merge } from 'lodash'
import { Trans } from 'react-i18next'

export const FlipCardHistory = (props: MoveComponentProps<MoveItem>) => {
  const { move, context } = props
  const actionPlayer = context.action.playerId
  const name = usePlayerName(actionPlayer)
  const card: CardItem = context.game.items[MaterialType.Card][move.itemIndex]
  const oldValue = getItemFaceValue(card)
  const oldColor = getItemFaceColor(card)
  const flippedCard: CardItem = { ...card, location: { ...card.location, rotation: move.location.rotation } }
  merge(flippedCard, move.reveal)
  const value = getItemFaceValue(flippedCard)
  const color = getItemFaceColor(flippedCard)
  const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

  if (value === JOKER) {
    return (
      <Trans defaults="history.flip.joker.player" values={{ player: name, color, oldValue, oldColor }}>
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
        {move.reveal?.id && <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, flippedCard)} transient />}
      </Trans>
    )
  }

  if (oldValue === JOKER) {
    return (
      <Trans defaults="history.flip.joker.old.player" values={{ player: name, color, value, oldColor }}>
        <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
        {move.reveal?.id && <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, flippedCard)} transient />}
      </Trans>
    )
  }

  return (
    <Trans defaults="history.flip.card.player" values={{ player: name, value, color, oldValue, oldColor }}>
      <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, card)} local />
      {move.reveal?.id && <PlayMoveButton move={displayMaterialHelp(MaterialType.Card, flippedCard)} transient />}
    </Trans>
  )
}
