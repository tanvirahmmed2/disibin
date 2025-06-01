import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './Component/NavBar'
import LogIn from './Component/LogIn'
import About from './Component/About'
import Home from './Home'
import Footer from './Component/Footer'
import Help from './Component/Help'

import WebDev from './Component/WebDev'
import UiUx from './Component/WebDev/UiUx'
import Frontend from './Component/WebDev/Frontend'
import Backend from './Component/WebDev/Backend'
import FullStack from './Component/WebDev/FullStack'
import WebApp from './Component/WebDev/WebApp'

import Card from './Component/Card/Card'

import Branding from './Component/Graphics/Branding'
import ProductDesign from './Component/Graphics/ProductDesign'
import VectorArt from './Component/Graphics/VectorArt'
import AdsDesign from './Component/Graphics/AdsDesign'
import BookDesign from './Component/Graphics/BookDesign'
import Graphics from './Component/Graphics'
import Generator from './Component/Generator'

export default function App() {
  return (
    <div className='relative font-sans w-full overflow-x-hidden'>

    
    <NavBar title='DisiBin'/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<LogIn title='DisiBin'/>}/>
      <Route path="/about" element={<About title='DisiBin' />} />
      <Route path="/help" element={<Help />} />
      
      <Route path="/web-dev" element={<WebDev title='DisiBin'/>} />
      <Route path="/ui-ux-dev" element={<UiUx/>} />
      <Route path="/front-end-dev" element={<Frontend/>} />
      <Route path="/back-end-dev" element={<Backend/>} />
      <Route path="/full-stack-dev" element={<FullStack/>} />
      <Route path='/web-app' element={<WebApp/>} />


      <Route path='/graphics' element={<Graphics title="DisiBin"/>}/>
      <Route path='/product-design' element={<ProductDesign/>}/>
      <Route path='/ads-design' element={<AdsDesign/>}/>
      <Route path='/book-design' element={<BookDesign/>}/>
      <Route path='/vector-art' element={<VectorArt/>}/>
      <Route path="/branding" element={<Branding/>} />

      <Route path='/generator' element={<Generator/>} />
      <Route path='/id-card' element={<Card/>}/>
      
    </Routes>
    <Footer title='DisiBin'/>
    </div>
  )
}
