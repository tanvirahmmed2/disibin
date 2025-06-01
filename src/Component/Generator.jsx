import React from 'react'
import usePageTitle from './usePageTitle'
import ClientDash from './Dashboard/ClientDash';
import DevDash from './Dashboard/DevDash';

function Generator() {
  usePageTitle("Generator");
  return (
    <>
    <ClientDash/>
    {/* <DevDash/> */}
    </>
    
  )
}

export default Generator
