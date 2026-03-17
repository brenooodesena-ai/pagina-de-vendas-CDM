import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button'

const rootElement = document.getElementById('button-root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div className="flex justify-center p-8">
        <LiquidMetalButton 
          label="Quero ter acesso" 
          onClick={() => {
            const pricingSection = document.getElementById('pricing-v5')
            if (pricingSection) {
              pricingSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        />
      </div>
    </React.StrictMode>,
  )
}
