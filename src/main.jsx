import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/SolarDashboard.css'
import SolarDashboard from './page/SolarDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SolarDashboard />
  </StrictMode>,
)
