import { faArrowDown, faMoneyCheckDollar, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardDescription, ItemContext, ItemMenuButton, pointerCursorCss } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { CardItem, Face, getItemFaceColor, getItemFaceValue } from '@gamepark/verso/material/Face'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { CustomMoveType } from '@gamepark/verso/rules/CustomMoveType'
import { PlayerLayoutHelper } from '@gamepark/verso/rules/helpers/PlayerLayoutHelper'
import { Trans } from 'react-i18next'
import FrontLand1 from '../images/cards/front/Land1.jpg'
import FrontLand2 from '../images/cards/front/Land2.jpg'
import FrontLand3 from '../images/cards/front/Land3.jpg'
import FrontLand4 from '../images/cards/front/Land4.jpg'
import FrontLand5 from '../images/cards/front/Land5.jpg'
import FrontLand6 from '../images/cards/front/Land6.jpg'
import FrontLandJoker from '../images/cards/front/LandJoker.jpg'
import FrontSea1 from '../images/cards/front/Sea1.jpg'
import FrontSea2 from '../images/cards/front/Sea2.jpg'
import FrontSea3 from '../images/cards/front/Sea3.jpg'
import FrontSea4 from '../images/cards/front/Sea4.jpg'
import FrontSea5 from '../images/cards/front/Sea5.jpg'
import FrontSea6 from '../images/cards/front/Sea6.jpg'
import FrontSeaJoker from '../images/cards/front/SeaJoker.jpg'
import FrontSky1 from '../images/cards/front/Sky1.jpg'
import FrontSky2 from '../images/cards/front/Sky2.jpg'
import FrontSky3 from '../images/cards/front/Sky3.jpg'
import FrontSky4 from '../images/cards/front/Sky4.jpg'
import FrontSky5 from '../images/cards/front/Sky5.jpg'
import FrontSky6 from '../images/cards/front/Sky6.jpg'
import FrontSkyJoker from '../images/cards/front/SkyJoker.jpg'
import ReverseLand1 from '../images/cards/reverse/Land1.jpg'
import ReverseLand2 from '../images/cards/reverse/Land2.jpg'
import ReverseLand3 from '../images/cards/reverse/Land3.jpg'
import ReverseLand4 from '../images/cards/reverse/Land4.jpg'
import ReverseLand5 from '../images/cards/reverse/Land5.jpg'
import ReverseLand6 from '../images/cards/reverse/Land6.jpg'
import ReverseSea1 from '../images/cards/reverse/Sea1.jpg'
import ReverseSea2 from '../images/cards/reverse/Sea2.jpg'
import ReverseSea3 from '../images/cards/reverse/Sea3.jpg'
import ReverseSea4 from '../images/cards/reverse/Sea4.jpg'
import ReverseSea5 from '../images/cards/reverse/Sea5.jpg'
import ReverseSea6 from '../images/cards/reverse/Sea6.jpg'
import ReverseSky1 from '../images/cards/reverse/Sky1.jpg'
import ReverseSky2 from '../images/cards/reverse/Sky2.jpg'
import ReverseSky3 from '../images/cards/reverse/Sky3.jpg'
import ReverseSky4 from '../images/cards/reverse/Sky4.jpg'
import ReverseSky5 from '../images/cards/reverse/Sky5.jpg'
import ReverseSky6 from '../images/cards/reverse/Sky6.jpg'
import { FaceCardHelp } from './help/FaceCardHelp'

export class FaceCardDescription extends CardDescription {
  height = 7.3
  width = 6
  borderRadius = 0.5

  images = frontImages

  backImages = reverseImages

  menuAlwaysVisible = true

  help = FaceCardHelp

  getItemMenu(card: CardItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const { type, index } = context
    const moves = legalMoves.filter(isMoveItemType(type)).filter((move) => move.itemIndex === index)
    const place = moves.find((move) => move.location.type === LocationType.PlayerLayout)
    const flip = moves.find((move) => move.location.type === LocationType.Deck)
    const isInPlayerLayout = card.location.type === LocationType.PlayerLayout && card.location.player === context.player
    const bank = legalMoves.find(isCustomMoveType(CustomMoveType.BankSequence))
    const helper = new PlayerLayoutHelper(context.rules.game, context.player)

    if (bank && isInPlayerLayout && helper.canCardMakeSequence(card, context.index)) {
      const color = getItemFaceColor(card)
      const value = getItemFaceValue(card)
      const higherCardsInColor = helper.playerCards.filter((item) => getItemFaceColor(item as CardItem) === color && getItemFaceValue(item as CardItem) > value)
      if (!higherCardsInColor.entries.some(([index, card]) => helper.canCardMakeSequence(card, index))) {
        return (
          <>
            <ItemMenuButton label={<Trans defaults="button.bank" />} angle={50} radius={4} y={-3.7} move={bank}>
              <FontAwesomeIcon icon={faMoneyCheckDollar} css={pointerCursorCss} />
            </ItemMenuButton>
          </>
        )
      }
    }
    return (
      <>
        {place && (
          <ItemMenuButton angle={50} radius={4} move={place}>
            <FontAwesomeIcon icon={faArrowDown} css={pointerCursorCss} />
          </ItemMenuButton>
        )}
        {flip && (
          <ItemMenuButton angle={50} radius={4} move={flip} y={-0.5}>
            <FontAwesomeIcon icon={faRotateRight} css={pointerCursorCss} />
          </ItemMenuButton>
        )}
      </>
    )
  }

  isFlipped(item: Partial<MaterialItem>) {
    return !!item.location?.rotation
  }

  canShortClick(move: MaterialMove, context: ItemContext) {
    return isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerBankSequenceLayout && move.itemIndex === context.index
  }
}

const frontImages = {
  [Face.Land1]: FrontLand1,
  [Face.Land2]: FrontLand2,
  [Face.Land3]: FrontLand3,
  [Face.Land4]: FrontLand4,
  [Face.Land5]: FrontLand5,
  [Face.Land6]: FrontLand6,
  [Face.LandJoker]: FrontLandJoker,
  [Face.Sea1]: FrontSea1,
  [Face.Sea2]: FrontSea2,
  [Face.Sea3]: FrontSea3,
  [Face.Sea4]: FrontSea4,
  [Face.Sea5]: FrontSea5,
  [Face.Sea6]: FrontSea6,
  [Face.SeaJoker]: FrontSeaJoker,
  [Face.Sky1]: FrontSky1,
  [Face.Sky2]: FrontSky2,
  [Face.Sky3]: FrontSky3,
  [Face.Sky4]: FrontSky4,
  [Face.Sky5]: FrontSky5,
  [Face.Sky6]: FrontSky6,
  [Face.SkyJoker]: FrontSkyJoker
}

const reverseImages = {
  [Face.Land1]: ReverseLand1,
  [Face.Land2]: ReverseLand2,
  [Face.Land3]: ReverseLand3,
  [Face.Land4]: ReverseLand4,
  [Face.Land5]: ReverseLand5,
  [Face.Land6]: ReverseLand6,
  [Face.Sea1]: ReverseSea1,
  [Face.Sea2]: ReverseSea2,
  [Face.Sea3]: ReverseSea3,
  [Face.Sea4]: ReverseSea4,
  [Face.Sea5]: ReverseSea5,
  [Face.Sea6]: ReverseSea6,
  [Face.Sky1]: ReverseSky1,
  [Face.Sky2]: ReverseSky2,
  [Face.Sky3]: ReverseSky3,
  [Face.Sky4]: ReverseSky4,
  [Face.Sky5]: ReverseSky5,
  [Face.Sky6]: ReverseSky6
}

export const faceCardDescription = new FaceCardDescription()
