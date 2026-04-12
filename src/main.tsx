import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BuilderStoreProvider } from './features/builder/store'

import { BrowserRouter } from "react-router";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BuilderStoreProvider>
        <App />
      </BuilderStoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
