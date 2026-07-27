import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { uniq } from 'es-toolkit'
import { Trans } from 'react-i18next'

const getPlayersNear = (players: number[], activePlayer?: number) => {
  const index = players.findIndex((p) => p === activePlayer)
  if (index === 0) {
    return uniq([players[players.length - 1], players[1]])
  }
  if (index === players.length - 1) {
    return uniq([players[players.length - 2], players[0]])
  }
  return uniq([players[index - 1], players[index + 1]])
}

export const FlipCardAfterBankSequenceHeader = () => {
  const player: number | undefined = usePlayerId()
  const rules = useRules<VersoRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player !== undefined && activePlayer === player
  const playersNear = getPlayersNear(rules.game.players, activePlayer)

  const name = usePlayerName(activePlayer)
  const next1 = usePlayerName(playersNear[0])
  const next2 = usePlayerName(playersNear[1])

  if (itsMe) {
    if (playersNear.length === 1) return <Trans i18nKey="header.after.bank.you.single" values={{ next1 }} />
    return <Trans i18nKey="header.after.bank.you.multi" values={{ next1, next2 }} />
  }

  if (playersNear.length === 1) {
    return <Trans i18nKey="header.after.bank.player.single" values={{ player: name, next1 }} />
  }
  return <Trans i18nKey="header.after.bank.player.multi" values={{ player: name, next1, next2 }} />
}
