/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation, useRules } from '@gamepark/react-game'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { FC } from 'react'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = () => {
  const margin = { top: 7, left: 0, right: 30, bottom: 0 }

  const getTableWidth = (): { xMin: number; xMax: number; yMin: number; yMax: number } => {
    const game: VersoRules = useRules()?.game
    const nbPlayers = game.players.length
    switch (nbPlayers) {
      case 1:
        return { xMin: -30, xMax: 30, yMin: -25, yMax: 25 }
      case 2:
        return { xMin: -50, xMax: 50, yMin: -25, yMax: 25 }
      case 3:
      case 4:
        return { xMin: -55, xMax: 55, yMin: -35, yMax: 35 }
      case 5:
        return { xMin: -60, xMax: 60, yMin: -35, yMax: 35 }
      default:
        return { xMin: -60, xMax: 60, yMin: -40, yMax: 40 }
    }
  }

  return (
    <>
      <GameTable
        xMin={getTableWidth().xMin}
        xMax={getTableWidth().xMax}
        yMin={getTableWidth().yMin}
        yMax={getTableWidth().yMax}
        margin={margin}
        css={process.env.NODE_ENV === 'development' && tableBorder}
      >
        <GameTableNavigation />
        <PlayerPanels />
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
