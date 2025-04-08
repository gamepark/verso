/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons/faRotateRight'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pointerCursorCss, useAnimations } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { FC } from 'react'

export const FlipButton: FC<{ location: Location }> = () => {
  const animations = useAnimations()
  if (animations.length > 0) return null
  return (
    <div css={[button]}>
      <FontAwesomeIcon icon={faRotateRight} css={pointerCursorCss}/>
    </div>


  )
}

const button = css`
  position: absolute;
  height: 1.7em;
  width: 1.7em;

  background-color: white;
  display: flex;
  color: black;
  align-items: center;
  justify-content: center;
  border-radius: 5em;
  box-shadow: 0.07em 0.07em 0 0 black;
  &:active {
    box-shadow: unset;
  }
`