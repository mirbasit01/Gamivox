import Hello from '@/components/hello'
import React from 'react'

const Home = () => {

  console.log('what is this ')
  return (
    <main>
          <div className='text-5xl'>welcome to nextjs</div>
          <Hello/>
    </main>
  )
}

export default Home