import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className='bg-dark text-white py-2'>
      <div className="container">
        <Link to="/" className='text-white text-decoration-none'>
          <h2 className='m-0'>My Vod</h2>
        </Link>
      </div>
    </header>
  )
}
