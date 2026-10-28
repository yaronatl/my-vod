import React from 'react'

export default function Footer() {
  return (
    <footer className='bg-dark text-white text-center py-2 mt-4'>
      My Vod {new Date().getFullYear()} - data from OMDb API
    </footer>
  )
}
