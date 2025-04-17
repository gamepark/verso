/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { CardItem } from '@gamepark/verso/material/Face'
import { FaceCardHelper } from '@gamepark/verso/rules/helpers/FaceCardHelper'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

const components = {
  bold: <strong />,
  underline: <u />
}

export const FaceCardHelp: FC<MaterialHelpProps> = (props) => {
  const { t } = useTranslation()
  const { item } = props
  const color = FaceCardHelper.getCardColor(item as CardItem)
  const value = FaceCardHelper.getCardValue(item as CardItem)
  const isJoker = FaceCardHelper.isJoker(item as CardItem)
  const points = item.location?.rotation ? 3 : 1

  const lowerValue = value === 1 ? 6 : value - 1
  const higtherValue = value === 6 ? 1 : value + 1

  const VersoValue = () => {
    if (isJoker) {
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
        <Trans defaults={isJoker ? 'card.joker' : `card.value`} values={{ value, points }} components={components} />
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
