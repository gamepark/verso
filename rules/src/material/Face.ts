import { getEnumValues } from '@gamepark/rules-api'

export enum Face {
  Sea1 = 11,
  Sea2,
  Sea3,
  Sea4,
  Sea5,
  Sea6,
  SeaJoker,
  Land1 = 21,
  Land2,
  Land3,
  Land4,
  Land5,
  Land6,
  LandJoker,
  Sky1 = 31,
  Sky2,
  Sky3,
  Sky4,
  Sky5,
  Sky6,
  SkyJoker
}

export enum FaceColor {
  Sea = 1,
  Land,
  Sky
}

export const getFaceColor = (face: Face) => Math.floor(face / 10) as FaceColor
export const isJoker = (face: Face) => face % 10 === 7

export type CardId = {
  front: Face
  back: Face
}

export function getCardIds(): CardId[] {
  const colors = getEnumValues(FaceColor)
  return getEnumValues(Face)
    .filter((face) => !isJoker(face))
    .flatMap((face) =>
      colors
        .filter((color) => getFaceColor(face) !== color)
        .flatMap((color) => [
          { front: face, back: color * 10 + (face % 10 === 1 ? 6 : face - 1) },
          { front: face, back: color * 10 + (face % 10 === 6 ? 1 : face + 1) }
        ])
    )
    .concat([
      { front: Face.Sea1, back: Face.LandJoker },
      { front: Face.Sea2, back: Face.SkyJoker },
      { front: Face.Sea3, back: Face.LandJoker },
      { front: Face.Sea4, back: Face.SkyJoker },
      { front: Face.Sea5, back: Face.LandJoker },
      { front: Face.Sea6, back: Face.SkyJoker },
      { front: Face.Land1, back: Face.SkyJoker },
      { front: Face.Land2, back: Face.SeaJoker },
      { front: Face.Land3, back: Face.SkyJoker },
      { front: Face.Land4, back: Face.SeaJoker },
      { front: Face.Land5, back: Face.SkyJoker },
      { front: Face.Land6, back: Face.SeaJoker },
      { front: Face.Sky1, back: Face.SeaJoker },
      { front: Face.Sky2, back: Face.LandJoker },
      { front: Face.Sky3, back: Face.SeaJoker },
      { front: Face.Sky4, back: Face.LandJoker },
      { front: Face.Sky5, back: Face.SeaJoker },
      { front: Face.Sky6, back: Face.LandJoker }
    ])
}
