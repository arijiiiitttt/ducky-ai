import { UserButton } from '@clerk/clerk-react'
import React from 'react'

const Content = () => {
  return (
    <div>
      <UserButton afterSignOutUrl='/'/>
    </div>
  )
}

export default Content
