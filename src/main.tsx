import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import pagesRoute from './route'
 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <BrowserRouter>
 {pagesRoute}
 </BrowserRouter>
  </StrictMode>,
)
