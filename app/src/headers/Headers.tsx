/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/verso/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseActionHeader } from './ChooseActionHeader'
import { DiscardCardHeader } from './DiscardCardHeader'
import { PlayCardHeader } from './PlayCardHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseAction]: ChooseActionHeader,
  [RuleId.PlayCard]: PlayCardHeader,
  [RuleId.DiscardCard]: DiscardCardHeader
}
