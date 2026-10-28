import React from 'react'
import { Link } from 'react-router-dom'

export default function Page404() {
  return (
    <div className='container text-center my-5'>
      <h1>404</h1>
      <h2>Page not found</h2>
      <Link to="/" className='btn btn-dark mt-3'>Back to list</Link>
    </div>
  )
}
