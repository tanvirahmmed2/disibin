import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './Component/NavBar'
import LogIn from './Component/LogIn'
import About from './Component/About'
import Home from './Home'
import Footer from './Component/Footer'
import Help from './Component/Help'
import Service from './Component/Service'
import UiUx from './Component/Service/UiUx'
import Frontend from './Component/Service/Frontend'
import Backend from './Component/Service/Backend'
import FullStack from './Component/Service/FullStack'
import Branding from './Component/Service/Branding'
import MenuBar from './Component/MenuBar'
import Card from './Component/Card/Card'

export default function App() {
  return (
    <div className='relative '>

    
    <NavBar title='DisiBin'/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<LogIn title='DisiBin'/>}/>
      <Route path="/about" element={<About title='DisiBin' />} />
      <Route path="/help" element={<Help />} />
      <Route path="/services" element={<Service title='DisiBin'/>} />
      <Route path="/ui-ux-dev" element={<UiUx/>} />
      <Route path="/front-end-dev" element={<Frontend/>} />
      <Route path="/back-end-dev" element={<Backend/>} />
      <Route path="/full-stack-dev" element={<FullStack/>} />
      <Route path="/branding" element={<Branding/>} />
      <Route path='/menubar' element={<MenuBar/>}/>
      <Route path='/id-card' element={<Card/>}/>
      
    </Routes>
    <Footer title='DisiBin'/>
    </div>
  )
}
