import React from 'react'
import { Link } from 'react-router-dom'
import Poster from './Poster'

export default function MovieCard({ item }) {
  return (
    <div className='col-12 col-md-6 col-lg-4 mb-3'>
      <div className='movie-card'>
        <Poster src={item.Poster} title={item.Title} />
        <div>
          <h4>{item.Title}</h4>
          <div className='mb-2 text-muted'>Year: {item.Year}</div>
          <Link to={"/info/" + item.imdbID} className='btn btn-dark'>More info</Link>
        </div>
      </div>
    </div>
  )
}
