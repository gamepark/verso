import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { Trans } from 'react-i18next'

export const PlayCardHeader = () => {
  const player = usePlayerId()
  const rules = useRules<VersoRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player
  const name = usePlayerName(activePlayer)

  if (itsMe) {
    return <Trans i18nKey="header.place.you" />
  }

  return <Trans i18nKey="header.place.player" values={{ player: name }} />
}
