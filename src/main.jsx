import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Lineal from './Components/GeoGebra/Lineal.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lineal />}/>
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
