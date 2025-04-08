import { CardDescription } from '@gamepark/react-game'
import { Face } from '@gamepark/verso/material/Face'

import FrontLand1 from '../images/cards/front/Land1.jpg'
import FrontLand2 from '../images/cards/front/Land2.jpg'
import FrontLand3 from '../images/cards/front/Land3.jpg'
import FrontLand4 from '../images/cards/front/Land4.jpg'
import FrontLand5 from '../images/cards/front/Land5.jpg'
import FrontLand6 from '../images/cards/front/Land6.jpg'
import FrontSea1 from '../images/cards/front/Sea1.jpg'
import FrontSea2 from '../images/cards/front/Sea2.jpg'
import FrontSea3 from '../images/cards/front/Sea3.jpg'
import FrontSea4 from '../images/cards/front/Sea4.jpg'
import FrontSea5 from '../images/cards/front/Sea5.jpg'
import FrontSea6 from '../images/cards/front/Sea6.jpg'
import FrontSky1 from '../images/cards/front/Sky1.jpg'
import FrontSky2 from '../images/cards/front/Sky2.jpg'
import FrontSky3 from '../images/cards/front/Sky3.jpg'
import FrontSky4 from '../images/cards/front/Sky4.jpg'
import FrontSky5 from '../images/cards/front/Sky5.jpg'
import FrontSky6 from '../images/cards/front/Sky6.jpg'

import BackLand1 from '../images/cards/back/Land1.jpg'
import BackLand2 from '../images/cards/back/Land2.jpg'
import BackLand3 from '../images/cards/back/Land3.jpg'
import BackLand4 from '../images/cards/back/Land4.jpg'
import BackLand5 from '../images/cards/back/Land5.jpg'
import BackLand6 from '../images/cards/back/Land6.jpg'
import BackLandJoker from '../images/cards/back/LandJoker.jpg'
import BackSea1 from '../images/cards/back/Sea1.jpg'
import BackSea2 from '../images/cards/back/Sea2.jpg'
import BackSea3 from '../images/cards/back/Sea3.jpg'
import BackSea4 from '../images/cards/back/Sea4.jpg'
import BackSea5 from '../images/cards/back/Sea5.jpg'
import BackSea6 from '../images/cards/back/Sea6.jpg'
import BackSeaJoker from '../images/cards/back/SeaJoker.jpg'
import BackSky1 from '../images/cards/back/Sky1.jpg'
import BackSky2 from '../images/cards/back/Sky2.jpg'
import BackSky3 from '../images/cards/back/Sky3.jpg'
import BackSky4 from '../images/cards/back/Sky4.jpg'
import BackSky5 from '../images/cards/back/Sky5.jpg'
import BackSky6 from '../images/cards/back/Sky6.jpg'
import BackSkyJoker from '../images/cards/back/SkyJoker.jpg'

export class FaceCardDescription extends CardDescription {
  height = 7.3
  width = 6
  borderRadius = 0.5

  images = frontImages

  backImages = backImages
}

const frontImages = {
  [Face.Land1]: FrontLand1,
  [Face.Land2]: FrontLand2,
  [Face.Land3]: FrontLand3,
  [Face.Land4]: FrontLand4,
  [Face.Land5]: FrontLand5,
  [Face.Land6]: FrontLand6,
  [Face.Sea1]: FrontSea1,
  [Face.Sea2]: FrontSea2,
  [Face.Sea3]: FrontSea3,
  [Face.Sea4]: FrontSea4,
  [Face.Sea5]: FrontSea5,
  [Face.Sea6]: FrontSea6,
  [Face.Sky1]: FrontSky1,
  [Face.Sky2]: FrontSky2,
  [Face.Sky3]: FrontSky3,
  [Face.Sky4]: FrontSky4,
  [Face.Sky5]: FrontSky5,
  [Face.Sky6]: FrontSky6
}

const backImages = {
  [Face.Land1]: BackLand1,
  [Face.Land2]: BackLand2,
  [Face.Land3]: BackLand3,
  [Face.Land4]: BackLand4,
  [Face.Land5]: BackLand5,
  [Face.Land6]: BackLand6,
  [Face.LandJoker]: BackLandJoker,
  [Face.Sea1]: BackSea1,
  [Face.Sea2]: BackSea2,
  [Face.Sea3]: BackSea3,
  [Face.Sea4]: BackSea4,
  [Face.Sea5]: BackSea5,
  [Face.Sea6]: BackSea6,
  [Face.SeaJoker]: BackSeaJoker,
  [Face.Sky1]: BackSky1,
  [Face.Sky2]: BackSky2,
  [Face.Sky3]: BackSky3,
  [Face.Sky4]: BackSky4,
  [Face.Sky5]: BackSky5,
  [Face.Sky6]: BackSky6,
  [Face.SkyJoker]: BackSkyJoker
}

export const faceCardDescription = new FaceCardDescription()

