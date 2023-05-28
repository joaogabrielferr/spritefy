import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SelectedColorProvider } from "./contexts/selectedColor/SelectedColorProvider.tsx";
import { SelectedToolProvider } from './contexts/selectedTool/SelectedToolProvider.tsx';
import 'react-tooltip/dist/react-tooltip.css';
import { PenSizeProvider } from './contexts/penSize/penSizeProvider.tsx';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SelectedColorProvider>
      <SelectedToolProvider>
        <PenSizeProvider>
        <App />
        </PenSizeProvider>
      </SelectedToolProvider>
    </SelectedColorProvider>
  </React.StrictMode>,
)
