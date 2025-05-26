/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { FC } from 'react'
import { SoloDialog } from './dialogs/SoloDialog'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = ({ players }: GameDisplayProps) => {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }

  const getTableWidth = (): { xMin: number; xMax: number; yMin: number; yMax: number } => {
    switch (players) {
      case 1:
        return { xMin: -30, xMax: 30, yMin: -25, yMax: 25 }
      case 2:
        return { xMin: -40, xMax: 40, yMin: -12, yMax: 35 }
      case 3:
        return { xMin: -65, xMax: 65, yMin: -20, yMax: 40 }
      case 4:
        return { xMin: -78, xMax: 78, yMin: -35, yMax: 35 }
      case 5:
        return { xMin: -75, xMax: 75, yMin: -45, yMax: 45 }
      default:
        return { xMin: -85, xMax: 70, yMin: -45, yMax: 45 }
    }
  }

  const getNavigationCss = () => {
    switch (players) {
      case 1:
      case 3:
        return css`
          left: 1em;
          top: 12em;
        `
      case 4:
        return css`
          left: 1em;
          top: 18em;
        `
      case 2:
      case 5:
      default:
        return css`
          left: 31em;
          top: 8em;
        `
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
        <GameTableNavigation css={getNavigationCss()} />
        <PlayerPanels />
        <SoloDialog />
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
