import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import pagesRoute from './route'
import {HeroUIProvider} from '@heroui/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <BrowserRouter>
 <HeroUIProvider>
 {pagesRoute}
 </HeroUIProvider>
 </BrowserRouter>
  </StrictMode>,
)
