import React from 'react'

import Intro from './Component/Intro'
import WebDev from './Component/WebDev'
import About from './Component/About'
import UiUx from './Component/WebDev/UiUx'
import Frontend from './Component/WebDev/Frontend'
import Backend from './Component/WebDev/Backend'
import FullStack from './Component/WebDev/FullStack'
import Branding from './Component/Graphics/Branding'
import Graphics from './Component/Graphics'

export default function Home() {
  return (
    <div className='px-4 py-2 flex flex-col w-full overflow-x-hidden'>
      <Intro title='DisiBin'/>
      <WebDev title='DisiBin'/>
      <UiUx/>
      <Frontend/>
      <Backend/>
      <FullStack/>
      <Graphics title="DisiBin"/>
      <Branding/>
      
      
      <About title="DisiBin"/>
    </div>
  )
}
