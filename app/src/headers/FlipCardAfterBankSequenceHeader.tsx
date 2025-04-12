/** @jsxImportSource @emotion/react */

import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { uniq } from 'lodash'
import { Trans } from 'react-i18next'

export const FlipCardAfterBankSequenceHeader = () => {
  const player: number | undefined = usePlayerId()
  const rules = useRules<VersoRules>()!
  const activePlayer = rules.game.rule?.player
  const itsMe = player && activePlayer === player

  const getPlayersNear = () => {
    const otherPlayers: number[] = useRules()?.game.players ?? []
    if (player === 1) {
      return uniq([otherPlayers.length, 2])
    }
    if (player === otherPlayers.length) {
      return uniq([otherPlayers.length - 1, 1])
    }
    return uniq([player! - 1, player! + 1])
  }

  if (itsMe) {
    if(getPlayersNear().length === 1) return <Trans defaults="header.after.bank.you.single" values={{next1: usePlayerName(getPlayersNear()[0])}} />
    return <Trans defaults="header.after.bank.you.multi" values={{ next1: usePlayerName(getPlayersNear()[0]), next2: usePlayerName(getPlayersNear()[1]) }} />
  }

  if(getPlayersNear().length === 1){
    return <Trans defaults="header.after.bank.player.single" values={{ player: usePlayerName(activePlayer), next1: usePlayerName(getPlayersNear()[0]) }} />
  }
  return <Trans defaults="header.after.bank.player.multi" values={{ player: usePlayerName(activePlayer), next1: usePlayerName(getPlayersNear()[0]), next2: usePlayerName(getPlayersNear()[1]) }} />

}
