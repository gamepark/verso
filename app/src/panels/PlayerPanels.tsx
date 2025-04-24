/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { Memory } from '@gamepark/verso/rules/Memory'
import { VersoRules } from '@gamepark/verso/VersoRules'
import Star from '../images/tokens/star.png'
import { createPortal } from 'react-dom'

export const PlayerPanels = () => {
  const players = usePlayers<number>({ sortFromMe: true })
  const root = document.getElementById('root')
  const rules = useRules<VersoRules>()!
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => (
        <StyledPlayerPanel
          key={player.id}
          player={player}
          color={playerColorCode[player.id]}
          css={panelPosition(index, players.length)}
          counters={[
            {
              image: Star,
              value: rules.remind(Memory.Score, player.id) || 0
            }
          ]}
        />
      ))}
    </>,
    root
  )
}
const panelPosition = (index: number, nbPlayers: number) => {
  if (nbPlayers === 2) {
    switch (index) {
      case 0:
        return css`
          position: absolute;
          left: 1em;
          top: 8.5em;
          width: 28em;
        `
      case 1:
        return css`
          position: absolute;
          right: 1em;
          top: 8.5em;
          width: 28em;
        `
      default:
        return css``
    }
  }
  return css`
    position: absolute;
    right: 1em;
    top: ${8.5 + index * 16}em;
    width: 28em;
  `
}

export const playerColorCode: Record<number, string> = {
  1: 'red',
  2: 'blue',
  3: 'green',
  4: 'yellow'
}
