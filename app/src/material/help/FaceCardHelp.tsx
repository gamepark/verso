/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { CardItem, getItemFaceColor, getItemFaceValue, JOKER } from '@gamepark/verso/material/Face'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

const components = {
  bold: <strong />,
  underline: <u />
}

export const FaceCardHelp: FC<MaterialHelpProps> = (props) => {
  const { t } = useTranslation()
  const { item } = props
  const color = getItemFaceColor(item as CardItem)
  const value = getItemFaceValue(item as CardItem)
  const points = item.location?.rotation ? 3 : 1

  const lowerValue = value === 1 ? 6 : value - 1
  const higherValue = value === 6 ? 1 : value + 1

  const VersoValue = () => {
    if (value === JOKER) {
      return <Trans defaults="verso.any" components={components} />
    }
    if (points === 1) {
      return <Trans defaults="verso.value" values={{ a: lowerValue, b: higherValue }} components={components} />
    }
    return <Trans defaults="verso.joker" values={{ a: lowerValue, b: higherValue }} components={components} />
  }

  return (
    <>
      <h2>{t(`card.${color}`)}</h2>
      <p>
        <Trans defaults={value === JOKER ? 'card.joker' : `card.value`} values={{ value, points }} components={components} />
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
