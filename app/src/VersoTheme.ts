import { css } from '@emotion/react'
import { GameTheme } from '@gamepark/react-game'

/**
 * Colors sampled from the game material: the deep navy of the silhouettes, the turquoise of the sea,
 * the green of the land and the orange of the sky.
 */
const ink = '#13293D'
const sea = '#0E7C97'
const seaLight = '#3EC7D4'
const land = '#6FA24B'
const sky = '#E97D34'

/**
 * The RulesDialog container has no padding (each content brings its own), so `display: flow-root`
 * is required to keep the content margins inside the dialog instead of collapsing through it.
 */
const dialogContainer = css`
  display: flow-root;
  background: linear-gradient(180deg, #fff6ec 0%, #f4fafc 45%, #e6f5fa 100%);
  border: 0.2em solid ${ink};
  border-radius: 1.2em;
  box-shadow: 0 0.5em 2em rgba(19, 41, 61, 0.55);
`

const dialogButtons = css`
  background: ${sea};
  border-color: ${ink};
  color: #ffffff;
  transition:
    background-color 0.15s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background: #0c6b82;
  }

  &:active:not(:disabled) {
    background: #0a5a6e;
    transform: translateY(0.05em);
  }

  &:disabled {
    background: transparent;
  }
`

export const versoTheme: GameTheme = {
  root: {
    fontFamily: 'Mulish',
    background: {
      image: '/cover-1920.jpg',
      overlay: 'rgba(19, 41, 61, 0.82)'
    }
  },
  palette: {
    primary: sea,
    primaryHover: '#0c6b82',
    primaryActive: '#0a5a6e',
    primaryLight: '#f0fafc',
    primaryLighter: '#d8eef4',
    surface: '#f1fafc',
    onSurface: ink,
    onSurfaceFocus: '#d8eef4',
    onSurfaceActive: '#bfe4ed',
    danger: '#a32a1c',
    dangerHover: '#f6dcd8',
    dangerActive: '#efc4be',
    disabled: '#7d8b98'
  },
  dialog: {
    backgroundColor: '#f4fafc',
    color: ink,
    container: dialogContainer,
    buttons: dialogButtons,
    closeIcon: css`
      color: ${ink};
      opacity: 0.6;

      &:hover {
        opacity: 1;
      }
    `
  },
  dropArea: {
    backgroundColor: 'rgba(62, 199, 212, 0.4)'
  },
  playerPanel: {
    // The two faces of a card: sky on one side, sea on the other
    activeRingColors: [sky, seaLight]
  },
  result: {
    border: sea,
    icon: land
  }
}
