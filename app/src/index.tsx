/** @jsxImportSource @emotion/react */
import { VersoOptionsSpec } from '@gamepark/verso/VersoOptions'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { VersoSetup } from '@gamepark/verso/VersoSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="verso"
      Rules={VersoRules}
      optionsSpec={VersoOptionsSpec}
      GameSetup={VersoSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
