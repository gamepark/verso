/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { FC } from 'react'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = ({ players }: GameDisplayProps) => {
  const margin = { top: 7, left: 0, right: players === 2 ? 0 : 30, bottom: 0 }

  const getTableWidth = (): { xMin: number; xMax: number; yMin: number; yMax: number } => {
    switch (players) {
      case 1:
        return { xMin: -30, xMax: 30, yMin: -25, yMax: 25 }
      case 2:
        return { xMin: -40, xMax: 40, yMin: -12, yMax: 35 }
      case 3:
      case 4:
        return { xMin: -55, xMax: 55, yMin: -35, yMax: 35 }
      case 5:
        return { xMin: -60, xMax: 60, yMin: -35, yMax: 35 }
      default:
        return { xMin: -60, xMax: 60, yMin: -45, yMax: 45 }
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
        {players !== 2 && <GameTableNavigation />}
        <PlayerPanels />
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
