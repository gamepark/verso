/** @jsxImportSource @emotion/react */
import { VersoOptionsSpec } from '@gamepark/verso/VersoOptions'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { VersoSetup } from '@gamepark/verso/VersoSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { versoAnimations } from './animations/VersoAnimations'
import App from './App'
import { VersoLogs } from './history/VersoLogs'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'
import { Tutorial } from './tutorial/Tutorial'

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
      tutorial={new Tutorial()}
      animations={versoAnimations}
      logs={new VersoLogs()}
    >
      <App />
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
