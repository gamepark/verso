import { GameTheme } from '@gamepark/react-game'

declare module '@emotion/react' {
  // Standard Emotion theme augmentation: the game theme IS the Emotion theme
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends GameTheme {}
}
