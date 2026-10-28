import React from 'react'

export default function ErrorMessage({ message }) {
  return (
    <div className='alert alert-warning my-3' role="alert">
      {message}
    </div>
  )
}
