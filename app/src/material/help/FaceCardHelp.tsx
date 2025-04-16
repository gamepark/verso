/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

const components = {
  bold: <strong />,
  underline: <u />
}

export const FaceCardHelp: FC<MaterialHelpProps> = (props) => {
  const { t } = useTranslation()
  //const rules = useRules<VersoRules>()!
  //const game = rules.game
  const { item } = props
  const getCurrentId = (item: Partial<MaterialItem>) => {
    return item.location!.rotation ? item.id.back : item.id.front
  }
  const color = Math.floor(getCurrentId(item) / 10)
  const value = getCurrentId(item) % 10
  const points = item.location?.rotation ? 3 : 1

  const lowerValue = value === 1 ? 6 : value - 1
  const higtherValue = value === 6 ? 1 : value + 1

  const VersoValue = () => {
    if (value === 0) {
      return <Trans defaults="verso.any" components={components} />
    }
    if (points === 1) {
      return <Trans defaults="verso.value" values={{ a: lowerValue, b: higtherValue }} components={components} />
    }
    return <Trans defaults="verso.joker" values={{ a: lowerValue, b: higtherValue }} components={components} />
  }

  return (
    <>
      <h2>{t(`card.${color}`)}</h2>
      <p>
        <Trans defaults={value === 0 ? 'card.joker' : `card.value`} values={{ value, points }} components={components} />
      </p>
      <Trans defaults="verso" />
      <ul css={listCss}>
        <li>
          <Trans defaults="verso.color" components={components} />
        </li>
        <li>
          <VersoValue />
        </li>
      </ul>
    </>
  )
}

const listCss = css`
  > li {
    margin-bottom: 0.5em;
  }
`
