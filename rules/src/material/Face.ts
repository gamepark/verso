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
          { front: face, back: color * 10 + (face % 10 === 1 ? 6 : (face % 10) - 1) },
          { front: face, back: color * 10 + (face % 10 === 6 ? 1 : (face % 10) + 1) }
        ])
    )
    .concat([
      { back: Face.Sea1, front: Face.LandJoker },
      { back: Face.Sea2, front: Face.SkyJoker },
      { back: Face.Sea3, front: Face.LandJoker },
      { back: Face.Sea4, front: Face.SkyJoker },
      { back: Face.Sea5, front: Face.LandJoker },
      { back: Face.Sea6, front: Face.SkyJoker },
      { back: Face.Land1, front: Face.SkyJoker },
      { back: Face.Land2, front: Face.SeaJoker },
      { back: Face.Land3, front: Face.SkyJoker },
      { back: Face.Land4, front: Face.SeaJoker },
      { back: Face.Land5, front: Face.SkyJoker },
      { back: Face.Land6, front: Face.SeaJoker },
      { back: Face.Sky1, front: Face.SeaJoker },
      { back: Face.Sky2, front: Face.LandJoker },
      { back: Face.Sky3, front: Face.SeaJoker },
      { back: Face.Sky4, front: Face.LandJoker },
      { back: Face.Sky5, front: Face.SeaJoker },
      { back: Face.Sky6, front: Face.LandJoker }
    ])
}
