/** @jsxImportSource @emotion/react */
import { RulesDialog, ThemeButton, useRules } from '@gamepark/react-game'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'

export const SoloDialog = () => {
  const { t } = useTranslation()
  const rules = useRules<VersoRules>()
  const isSolo = rules?.players.length === 1
  const [explain, setExplain] = useState(false)
  useEffect(() => {
    if (isSolo) setExplain(true)
  }, [isSolo])
  return (
    <RulesDialog open={explain} close={() => setExplain(false)}>
      <div css={rulesCss}>
        <h2>{t('rules.solo')}</h2>
        <p>{t('rules.solo.text.1')}</p>
        <p>{t('rules.solo.text.2')}</p>
        <ul>
          <li>{t('rules.solo.text.3')}</li>
          <li>{t('rules.solo.text.4')}</li>
        </ul>
        <p>{t('rules.solo.text.5')}</p>
        <ThemeButton onClick={() => setExplain(false)}>{t('OK')}</ThemeButton>
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
