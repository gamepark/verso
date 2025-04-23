import { getEnumValues, MaterialItem } from '@gamepark/rules-api'
import { uniq } from 'lodash'

export enum Face {
  SeaJoker = 10,
  Sea1,
  Sea2,
  Sea3,
  Sea4,
  Sea5,
  Sea6,
  LandJoker = 20,
  Land1,
  Land2,
  Land3,
  Land4,
  Land5,
  Land6,
  SkyJoker = 30,
  Sky1,
  Sky2,
  Sky3,
  Sky4,
  Sky5,
  Sky6
}

export enum FaceColor {
  Sea = 1,
  Land,
  Sky
}

export const JOKER = 0
export const getFaceColor = (face: Face) => Math.floor(face / 10) as FaceColor
export const getFaceValue = (face: Face) => face % 10
export const isJoker = (face: Face) => getFaceValue(face) === JOKER

export type CardId = {
  front: Face
  back: Face
}

export type CardItem = MaterialItem<number, number, CardId>

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

export const getItemFace = (item: CardItem): Face => (item.location.rotation ? item.id.back : item.id.front)
export const getItemFaceColor = (item: CardItem): FaceColor => getFaceColor(getItemFace(item))
export const getItemFaceValue = (item: CardItem): number => getFaceValue(getItemFace(item))

export function isValidSequence(faces: Face[]) {
  if (faces.length < 2 || faces.length > 6) return false
  const sequenceColor = getFaceColor(faces[0])
  if (faces.some((face) => getFaceColor(face) !== sequenceColor)) return false
  const values = faces.map(getFaceValue).sort()
  if (uniq(values).length !== values.length) return false
  const minValue = values[0] === JOKER ? values[1] : values[0]
  const maxValue = values[values.length - 1]
  return maxValue - minValue < values.length
}
