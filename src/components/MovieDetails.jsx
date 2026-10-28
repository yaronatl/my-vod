import React from 'react'
import Poster from './Poster'
import { valueOrNull } from '../services/omdb'

const show = (v) => valueOrNull(v) || "Not available";

export default function MovieDetails({ movie }) {
  return (
    <div className='info-page text-center'>
      <Poster src={movie.Poster} title={movie.Title} large />
      <h2 className='mt-2'>{movie.Title}</h2>
      <p>Runtime: {show(movie.Runtime)}</p>
      <p>Rating: {show(movie.imdbRating)}</p>
      <p>Genre: {show(movie.Genre)}</p>
      <p>Actors: {show(movie.Actors)}</p>
      <p className='mx-auto col-lg-8'>Plot: {show(movie.Plot)}</p>
    </div>
  )
}
