import { GameProvider } from '@gamepark/react-game'
import { VersoOptionsSpecV2 } from '@gamepark/verso/VersoOptions'
import { VersoRules } from '@gamepark/verso/VersoRules'
import { VersoSetup } from '@gamepark/verso/VersoSetup'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { versoAnimations } from './animations/VersoAnimations'
import { App } from './App'
import { VersoLogs } from './history/VersoLogs'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import { Tutorial } from './tutorial/Tutorial'
import { versoTheme } from './VersoTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="verso"
      Rules={VersoRules}
      optionsSpec={VersoOptionsSpecV2}
      GameSetup={VersoSetup}
      material={Material}
      locators={Locators}
      tutorial={new Tutorial()}
      animations={versoAnimations}
      logs={new VersoLogs()}
      theme={versoTheme}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
