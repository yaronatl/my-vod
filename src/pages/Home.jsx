import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchHeader from '../components/SearchHeader'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { searchMovies, DEFAULT_TERM } from '../services/omdb'

export default function Home() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const [query] = useSearchParams();
  const term = (query.get("s") || "").trim() || DEFAULT_TERM;

  useEffect(() => {
    // ignore stale responses when the term changes quickly
    let ignore = false;
    const controller = new AbortController();
    const doApi = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { movies } = await searchMovies(term, 1, controller.signal);
        if (!ignore) setList(movies);
      } catch (err) {
        if (!ignore) {
          setList([]);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    doApi();
    return () => { ignore = true; controller.abort(); };
  }, [term]);

  const onSearch = (value) => {
    // the search lives in the URL so the back button restores it
    nav("/?s=" + encodeURIComponent(value));
  }

  return (
    <>
      <SearchHeader term={term} onSearch={onSearch} />
      <div className='container'>
        <h1 className='h2'>List of {term}</h1>
        {isLoading && <Loading />}
        {!isLoading && error && <ErrorMessage message={error} />}
        <div className="row mt-3">
          {!isLoading && list.map(item => (
            <MovieCard key={item.imdbID} item={item} />
          ))}
        </div>
      </div>
    </>
  )
}
