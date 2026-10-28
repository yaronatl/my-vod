import React from 'react'
import Banner from './Banner'
import SearchBar from './SearchBar'

export default function SearchHeader({ term, onSearch }) {
  return (
    <header className='search-header'>
      <Banner />
      <div className='container'>
        <SearchBar initialValue={term} onSearch={onSearch} />
      </div>
    </header>
  )
}
