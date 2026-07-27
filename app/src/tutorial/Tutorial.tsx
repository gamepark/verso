import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isMoveItemType, isStartRule } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/verso/material/LocationType'
import { MaterialType } from '@gamepark/verso/material/MaterialType'
import { RuleId } from '@gamepark/verso/rules/RuleId'
import { Trans } from 'react-i18next'
import { me, opponent, TutorialSetup } from './TutorialSetup'

const BaseComponents = {
  bold: <strong />,
  italic: <em />
}

export class Tutorial extends MaterialTutorial<number, MaterialType, LocationType> {
  version = 2

  options = {
    players: [{ id: me }, { id: opponent }]
  }

  players = [
    { id: me },
    {
      id: opponent,
      name: 'Zongoh',
      avatar: {
        topType: 'NoHair',
        accessoriesType: 'Blank',
        facialHairType: 'BeardMajestic',
        facialHairColor: 'Red',
        clotheType: 'Overall',
        clotheColor: 'Black',
        eyeType: 'Surprised',
        eyebrowType: 'RaisedExcited',
        mouthType: 'ScreamOpen',
        skinColor: 'Light'
      }
    }
  ]

  setup = new TutorialSetup()

  steps: TutorialStep[] = [
    {
      popup: {
        text: () => <Trans i18nKey="tuto.welcome" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.deck" components={BaseComponents} />,
        position: { x: -20, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.Deck)
            .maxBy((item) => item.location.x!)
        ],
        scale: 0.8
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.card" components={BaseComponents} />,
        position: { x: -20, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.Deck)
            .maxBy((item) => item.location.x!)
        ],
        scale: 0.8
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.points" components={BaseComponents} />,
        position: { x: -20, y: 10 }
      },
      focus: (game) => ({
        locations: this.material(game, MaterialType.Card)
          .location(LocationType.Deck)
          .getIndexes()
          .map((parent) => ({
            type: LocationType.FaceCardPoints,
            parent
          })),
        scale: 1
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.verso" components={BaseComponents} />,
        position: { x: -20, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.Deck)
            .maxBy((item) => item.location.x!)
        ],
        scale: 0.8
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.flip" components={BaseComponents} />,
        position: { x: -20, y: 15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.Deck)
            .maxBy((item) => item.location.x!)
        ],
        scale: 0.8
      }),
      move: {
        filter: (move, _) => {
          return isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.Deck
        },
        interrupt: (move) => isStartRule(move) && move.id === RuleId.PlayCard
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place" components={BaseComponents} />
      },
      move: {}
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.playerlayout" components={BaseComponents} />
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Card).location(LocationType.PlayerLayout).player(me)],
        scale: 0.5
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent" components={BaseComponents} />
      },
      move: {
        player: opponent,
        filter: (move, _) => {
          return isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout && move.location.player === opponent
        }
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent.place" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place.without.flip" components={BaseComponents} />
      },
      move: {
        player: me,
        filter: (move, _) => {
          return isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout && move.location.player === me
        }
      }
    },
    {
      move: {
        player: opponent,
        filter: (move, _) => {
          return isMoveItemType(MaterialType.Card)(move) && move.location.type === LocationType.PlayerLayout && move.location.player === opponent
        }
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.choose.action" components={BaseComponents} />
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Card).location(LocationType.PlayerLayout).player(me)],
        scale: 0.8
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.sequence" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.bank.validate" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.bank.discard" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.bank.flip" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.joker" components={BaseComponents} />,
        position: { x: -20, y: 10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.Deck)
            .maxBy((item) => item.location.x!)
        ],
        scale: 0.8
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.score" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.square" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end" components={BaseComponents} />
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.go" components={BaseComponents} />
      }
    }
  ]
}
