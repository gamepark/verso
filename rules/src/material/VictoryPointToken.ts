import { getEnumValues } from '@gamepark/rules-api'

export enum VictoryPointToken {
  victoryPointToken1 = 1,
  victoryPointToken3 = 3,
  victoryPointToken7 = 7,
  victoryPointToken10 = 10,
  victoryPointToken20 = 20
}

export const victoryPointTokens = getEnumValues(VictoryPointToken)
