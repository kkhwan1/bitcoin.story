import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { StyleSheetManager } from 'styled-components';
import './styles/reset.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={(prop) => prop !== 'theme'}>
      <App />
    </StyleSheetManager>
  </React.StrictMode>
) 