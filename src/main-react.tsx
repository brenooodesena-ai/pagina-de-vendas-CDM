import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button'

const rootElement = document.getElementById('button-root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div className="flex justify-center p-8 overflow-visible w-full">
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

const checkoutRootElement = document.getElementById('checkout-button-root')
if (checkoutRootElement) {
  ReactDOM.createRoot(checkoutRootElement).render(
    <React.StrictMode>
      <div className="flex justify-center p-8 overflow-visible w-full">
        <LiquidMetalButton 
          width={420} // Larger size for the longer bottom button text
          label="GARANTIR MEU ACESSO AGORA" 
          onClick={() => {
            // Redirect to Kiwify Checkout
            window.location.href = 'https://pay.kiwify.com.br/Lezh01Z'
          }}
        />
      </div>
    </React.StrictMode>,
  )
}
const journeyButtonRoot = document.getElementById('journey-button-root')
if (journeyButtonRoot) {
  ReactDOM.createRoot(journeyButtonRoot).render(
    <React.StrictMode>
      <div className="flex justify-center overflow-visible w-full">
        <LiquidMetalButton 
          label="MATRICULE-SE" 
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
