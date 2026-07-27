import { RulesDialog, ThemeButton, useRules } from '@gamepark/react-game'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'

export const SoloDialog = () => {
  const { t } = useTranslation()
  const rules = useRules<VersoRules>()
  const isSolo = rules?.players.length === 1
  const [dismissed, setDismissed] = useState(false)
  return (
    <RulesDialog open={isSolo && !dismissed} close={() => setDismissed(true)}>
      <div css={rulesCss}>
        <h2>{t('rules.solo')}</h2>
        <p>{t('rules.solo.text.1')}</p>
        <p>{t('rules.solo.text.2')}</p>
        <ul>
          <li>{t('rules.solo.text.3')}</li>
          <li>{t('rules.solo.text.4')}</li>
        </ul>
        <p>{t('rules.solo.text.5')}</p>
        <ThemeButton onClick={() => setDismissed(true)}>{t('OK', { ns: 'common' })}</ThemeButton>
      </div>
    </RulesDialog>
  )
}

const rulesCss = css`
  max-width: 40em;
  margin: 1em;
  font-size: 3em;

  > h2 {
    margin: 0 1em;
    text-align: center;
  }

  > p {
    white-space: break-spaces;
  }
`
