import { FaceColor } from '../material/Face'

export enum ScoreType {
  Sequence = 1,
  Square
}

export type SquareScore = {
  type: ScoreType.Square
  player: number
  score: number
}

export type SequenceScore = {
  type: ScoreType.Sequence
  player: number
  score: number
  color: FaceColor
}

export type Scoring = SquareScore | SequenceScore
