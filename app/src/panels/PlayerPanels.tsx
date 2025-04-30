/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { Memory } from '@gamepark/verso/rules/Memory'
import { VersoRules } from '@gamepark/verso/VersoRules'
import Star from '../images/tokens/star.png'
import { createPortal } from 'react-dom'
import panel1 from '../images/panels/panel1.jpg'
import panel2 from '../images/panels/panel2.jpg'
import panel3 from '../images/panels/panel3.jpg'
import panel4 from '../images/panels/panel4.jpg'
import panel5 from '../images/panels/panel5.jpg'
import panel6 from '../images/panels/panel6.jpg'

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
          backgroundImage={images[player.id]}
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

const panelPosition = (players: number, index: number) => css`
  position: absolute;
  width: 28em;
  height: 8.3em;
  border: 0;
  ${getPanelPosition(players, index)};
`

const bottomRight = css`
  bottom: 1em;
  right: 1em;
`

const bottomLeft = css`
  bottom: 1em;
  left: 1em;
`

const topRight = css`
  top: 8.5em;
  right: 1em;
`

const topLeft = css`
  top: 8.5em;
  left: 1em;
`

const topCenter = css`
  top: 8.5em;
  left: calc(50dvw - 14em);
`

const bottomCenter = css`
  bottom: 1em;
  left: calc(50dvw - 14em);
`

const getPanelPosition = (index: number, nbPlayers: number) => {
  switch (index) {
    case 0:
      if (nbPlayers === 1) return topRight
      if (nbPlayers === 2) return topLeft
      if (nbPlayers === 3) return bottomLeft
      if (nbPlayers === 4) return bottomLeft
      if (nbPlayers === 5) return bottomLeft
      return bottomLeft
    case 1:
      if (nbPlayers === 2) return topRight
      if (nbPlayers === 3) return bottomCenter
      if (nbPlayers === 4) return topLeft
      if (nbPlayers === 5) return topLeft
      return topLeft
    case 2:
      if (nbPlayers === 3) return bottomRight
      if (nbPlayers === 4) return topRight
      if (nbPlayers === 5) return topCenter
      return topCenter
    case 3:
      if (nbPlayers === 4) return bottomRight
      if (nbPlayers === 5) return topRight
      return topRight
    case 4:
      if (nbPlayers === 5) return bottomRight
      return bottomRight
    case 5:
    default:
      return bottomCenter
  }
}

export const playerColorCode: Record<number, string> = {
  1: 'red',
  2: 'blue',
  3: 'green',
  4: 'yellow'
}

const images: Record<number, string> = {
  1: panel1,
  2: panel2,
  3: panel3,
  4: panel4,
  5: panel5,
  6: panel6
}
