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

  const versoValue =
    value === JOKER ? (
      <Trans i18nKey="verso.any" components={components} />
    ) : points === 1 ? (
      <Trans i18nKey="verso.value" values={{ a: lowerValue, b: higherValue }} components={components} />
    ) : (
      <Trans i18nKey="verso.joker" values={{ a: lowerValue, b: higherValue }} components={components} />
    )

  return (
    <>
      <h2>{t(`card.${color}`)}</h2>
      <p>
        <Trans i18nKey={value === JOKER ? 'card.joker' : `card.value`} values={{ value, points }} components={components} />
      </p>
      <Trans i18nKey="verso" />
      <ul css={listCss}>
        <li>
          <Trans i18nKey="verso.color" components={components} />
        </li>
        <li>{versoValue}</li>
      </ul>
    </>
  )
}

const listCss = css`
  > li {
    margin-bottom: 0.5em;
  }
`
