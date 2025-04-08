/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/verso/rules/RuleId'
import { ComponentType } from 'react'
import { ChoiceActionHeader } from './ChoiceActionHeader'
import { DrawCardHeader } from './DrawCardHeader'
import { PlayCardHeader } from './PlayCardHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChoiceAction]: ChoiceActionHeader,
  [RuleId.DrawCard]: DrawCardHeader,
  [RuleId.PlayCard]: PlayCardHeader
}
