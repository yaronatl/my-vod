import React, { useEffect, useState } from 'react'

export default function SearchBar({ initialValue = "", onSearch }) {
  const [value, setValue] = useState(initialValue);
  const [emptyWarning, setEmptyWarning] = useState(false);

  // keep the input in sync with the URL (browser back button)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onSub = (e) => {
    e.preventDefault();
    const term = value.trim();
    if (!term) {
      setEmptyWarning(true);
      return;
    }
    setEmptyWarning(false);
    onSearch(term);
  }

  return (
    <form onSubmit={onSub} className='col-lg-6 my-3' role="search">
      <div className='d-flex'>
        <input
          type="search"
          className='form-control'
          placeholder='Search a movie...'
          aria-label='Search a movie'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className='btn btn-warning ms-2'>Search</button>
      </div>
      {emptyWarning && <div className='text-danger small mt-1'>Please type a movie title.</div>}
    </form>
  )
}
