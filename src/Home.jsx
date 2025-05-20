import React from 'react'
import Intro from './Component/Intro'
import Service from './Component/Service'
import About from './Component/About'
import UiUx from './Component/Service/UiUx'
import Frontend from './Component/Service/Frontend'
import Backend from './Component/Service/Backend'
import FullStack from './Component/Service/FullStack'
import Branding from './Component/Service/Branding'

export default function Home() {
  return (
    <div className='px-4 py-2 flex flex-col'>
      <Intro title='DisiBin'/>
      <Service title='DisiBin'/>
      <UiUx/>
      <Frontend/>
      <Backend/>
      <FullStack/>
      <Branding/>
      
      <About title="DisiBin"/>
    </div>
  )
}
