/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/verso/rules/RuleId'
import { ComponentType } from 'react'
import { BankLastSequenceHeader } from './BankLastSequenceHeader'
import { BankSequenceHeader } from './BankSequenceHeader'
import { ChooseActionHeader } from './ChooseActionHeader'
import { DiscardCardHeader } from './DiscardCardHeader'
import { FlipCardAfterBankSequenceHeader } from './FlipCardAfterBankSequenceHeader'
import { PlayCardHeader } from './PlayCardHeader'
import { SimulateOtherPlayerHeader } from './SimulateOtherPlayerHeader'
import { SimulateOtherPlayerWithoutConsequencesHeader } from './SimulateOtherPlayerWithoutConsequencesHeader'
import { SimulateOtherPlayerWithConsequencesHeader } from './SimulateOtherPlayerWithConsequencesHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.ChooseAction]: ChooseActionHeader,
  [RuleId.PlayCard]: PlayCardHeader,
  [RuleId.DiscardCard]: DiscardCardHeader,
  [RuleId.BankSequence]: BankSequenceHeader,
  [RuleId.FlipCardAfterBankSequence]: FlipCardAfterBankSequenceHeader,
  [RuleId.BankLastSequence]: BankLastSequenceHeader,
  [RuleId.SimulateOtherPlayer]: SimulateOtherPlayerHeader,
  [RuleId.SimulateOtherPlayerWithoutConsequences]: SimulateOtherPlayerWithoutConsequencesHeader,
  [RuleId.SimulateOtherPlayerWithConsequences]: SimulateOtherPlayerWithConsequencesHeader,
}
