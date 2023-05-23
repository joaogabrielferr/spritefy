import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SelectedColorProvider } from "./contexts/selectedColor/SelectedColorProvider.tsx";
import { SelectedToolProvider } from './contexts/selectedTool/SelectedToolProvider.tsx';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SelectedColorProvider>
      <SelectedToolProvider>
        <App />
      </SelectedToolProvider>
    </SelectedColorProvider>
  </React.StrictMode>,
)
