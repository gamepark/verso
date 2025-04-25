/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { Trans, useTranslation } from 'react-i18next'

export const BankLastSequenceHeader = () => {
  const { t } = useTranslation()
  const playerId: number | undefined = usePlayerId()
  const activePlayers = useRules<VersoRules>()?.game.rule?.players ?? []
  const player = usePlayerName(activePlayers[0])
  const validate = useLegalMove(isCustomMoveType(CustomMoveType.Score))
  if (playerId !== undefined && activePlayers.includes(playerId)) {
    return (
      <Trans
        defaults="header.bank.last.you"
        components={{
          validate: <PlayMoveButton move={validate} />
        }}
      />
    )
  } else if (activePlayers.length === 1) {
    return <>{t('header.bank.last.player', { player })}</>
  } else {
    return <>{t('header.bank.last.others')}</>
  }
}
